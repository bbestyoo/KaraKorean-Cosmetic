import hashlib
import logging
import re
import time
import uuid

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

META_EVENT_WHITELIST = {
    "ViewContent",
    "AddToCart",
    "InitiateCheckout",
    "AddToWishlist",
    "Search",
    "Contact",
}

META_GRAPH_URL = "https://graph.facebook.com"


def _sha256(value):
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _normalize_email(email):
    if not email:
        return None
    return str(email).strip().lower() or None


def _normalize_phone(phone):
    if not phone:
        return None
    digits = re.sub(r"\D", "", str(phone))
    if not digits:
        return None
    if digits.startswith("00"):
        digits = digits[2:]
    if len(digits) == 10 and digits.startswith("9"):
        digits = f"977{digits}"
    return digits or None


def _split_name(full_name):
    if not full_name:
        return None, None
    parts = str(full_name).strip().lower().split()
    if not parts:
        return None, None
    return " ".join(parts[:1]) or None, " ".join(parts[1:]) or None


def _client_ip(request):
    if request is None:
        return None
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def build_user_data(
    *,
    email=None,
    phone=None,
    full_name=None,
    external_id=None,
    fbp=None,
    fbc=None,
    country=None,
    request=None,
):
    first_name, last_name = _split_name(full_name)
    data = {
        "em": [_sha256(_normalize_email(email))] if _normalize_email(email) else None,
        "ph": [_sha256(_normalize_phone(phone))] if _normalize_phone(phone) else None,
        "fn": [_sha256(first_name)] if first_name else None,
        "ln": [_sha256(last_name)] if last_name else None,
        "external_id": [_sha256(external_id)] if external_id is not None else None,
        "country": [_sha256(str(country).lower())] if country else None,
        "fbp": fbp or None,
        "fbc": fbc or None,
    }

    if request is not None:
        data["client_ip_address"] = _client_ip(request)
        data["client_user_agent"] = request.META.get("HTTP_USER_AGENT")

    return {key: value for key, value in data.items() if value not in (None, "", [])}


def send_meta_event(
    event_name,
    *,
    event_id=None,
    event_source_url=None,
    custom_data=None,
    user_data=None,
    request=None,
):
    pixel_id = getattr(settings, "META_PIXEL_ID", "")
    access_token = getattr(settings, "META_ACCESS_TOKEN", "")

    if not pixel_id or not access_token:
        logger.warning("Meta CAPI skipped: META_PIXEL_ID or META_ACCESS_TOKEN is not configured")
        return None

    if event_name not in META_EVENT_WHITELIST and event_name != "Purchase":
        logger.warning("Meta CAPI skipped: unsupported event %s", event_name)
        return None

    user_data = dict(user_data or {})
    if request is not None:
        user_data.setdefault("client_ip_address", _client_ip(request))
        user_data.setdefault("client_user_agent", request.META.get("HTTP_USER_AGENT"))
    user_data = {key: value for key, value in user_data.items() if value not in (None, "", [])}

    source_url = (
        event_source_url
        or getattr(settings, "FRONTEND_URL", "")
        or "https://www.karakoreanbeauty.com"
    )

    event = {
        "event_name": event_name,
        "event_time": int(time.time()),
        "event_id": str(event_id or uuid.uuid4()),
        "action_source": "website",
        "event_source_url": source_url,
        "user_data": user_data,
        "custom_data": custom_data or {},
    }

    payload = {
        "data": [event],
        "access_token": access_token,
    }

    test_event_code = getattr(settings, "META_TEST_EVENT_CODE", None)
    if test_event_code:
        payload["test_event_code"] = test_event_code

    api_version = getattr(settings, "META_API_VERSION", "v23.0")
    url = f"{META_GRAPH_URL}/{api_version}/{pixel_id}/events"

    try:
        response = requests.post(url, json=payload, timeout=5)
        result = response.json()
    except (requests.RequestException, ValueError) as exc:
        logger.warning("Meta CAPI %s request failed: %s", event_name, exc)
        return None

    if response.status_code >= 400:
        error_message = (result or {}).get("error", {}).get("message", "Unknown error")
        logger.error(
            "Meta CAPI %s failed with HTTP %s: %s",
            event_name,
            response.status_code,
            error_message,
        )
        return result

    logger.info("Meta CAPI %s sent with event_id=%s", event_name, event["event_id"])
    return result


def send_purchase_event(
    order,
    delivery,
    request=None,
    *,
    event_id=None,
    fbp=None,
    fbc=None,
    event_source_url=None,
):
    order_items = list(order.order_items.select_related("product", "size"))

    contents = []
    content_ids = []
    for item in order_items:
        product_id = str(item.product.product_id)
        content_ids.append(product_id)
        contents.append(
            {
                "id": product_id,
                "quantity": int(item.quantity),
                "item_price": float(item.price),
            }
        )

    custom_data = {
        "currency": getattr(settings, "META_CURRENCY", "NPR"),
        "value": float(delivery.payment_amount or 0),
        "content_ids": content_ids,
        "content_type": "product",
        "contents": contents,
        "num_items": sum(int(item.quantity) for item in order_items),
        "order_id": str(order.id),
    }

    user_data = build_user_data(
        email=delivery.email,
        phone=delivery.phone_number,
        full_name=delivery.full_name,
        external_id=order.user_id,
        fbp=fbp,
        fbc=fbc,
        country="NP",
        request=request,
    )

    source_url = event_source_url or (
        f"{getattr(settings, 'FRONTEND_URL', 'https://www.karakoreanbeauty.com').rstrip('/')}"
        f"/order-confirmation/{order.id}"
    )

    return send_meta_event(
        "Purchase",
        event_id=event_id or str(order.id),
        event_source_url=source_url,
        custom_data=custom_data,
        user_data=user_data,
        request=request,
    )
