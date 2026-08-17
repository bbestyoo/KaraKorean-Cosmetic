"""
On-demand ISR revalidation for the Next.js frontend.

Any time a Product (or a related model that affects how products render) is
saved or deleted in Django, we notify the frontend so it invalidates its
ISR cache immediately instead of waiting for the time-based revalidate window.
"""
import requests
from django.conf import settings


def revalidate_frontend(*, tags=None, paths=None, product_ids=None):
    """Tell the Next.js frontend to revalidate the given ISR tags/paths.

    Uses print() for output so messages always appear in gunicorn stdout
    regardless of Django LOGGING configuration.
    """
    secret = getattr(settings, 'REVALIDATE_SECRET', None)
    site_url = (getattr(settings, 'FRONTEND_URL', None) or '').rstrip('/')

    if not secret or not site_url:
        print(f"[ISR] SKIP: REVALIDATE_SECRET={'set' if secret else 'MISSING'} FRONTEND_URL={site_url!r}")
        return

    tags = list(tags or [])
    paths = list(paths or [])
    if product_ids:
        paths.extend(f'/products/{product_id}' for product_id in product_ids)

    if not tags and not paths:
        print("[ISR] SKIP: no tags or paths to revalidate")
        return

    payload = {'tags': tags, 'paths': paths}
    url = f'{site_url}/api/revalidate'
    print(f"[ISR] POST {url} payload={payload}")
    try:
        response = requests.post(
            url,
            json=payload,
            headers={'X-Revalidate-Secret': secret},
            timeout=10,
        )
        print(f"[ISR] Response {response.status_code}: {response.text[:200]}")
    except Exception as e:
        print(f"[ISR] FAILED: {e}")
