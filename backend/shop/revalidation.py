"""
On-demand ISR revalidation for the Next.js frontend.

Any time a Product (or a related model that affects how products render) is
saved or deleted in Django, we notify the frontend so it invalidates its
ISR cache immediately instead of waiting for the time-based revalidate window.
"""
import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def revalidate_frontend(*, tags=None, paths=None, product_ids=None):
    """Tell the Next.js frontend to revalidate the given ISR tags/paths.

    All arguments are optional but at least one must resolve to something.
    Safe to call from signals: it never raises and silently no-ops when the
    integration is not configured (local dev).
    """
    secret = getattr(settings, 'REVALIDATE_SECRET', None)
    site_url = (getattr(settings, 'FRONTEND_URL', None) or '').rstrip('/')

    if not secret or not site_url:
        return

    tags = list(tags or [])
    paths = list(paths or [])
    if product_ids:
        paths.extend(f'/products/{product_id}' for product_id in product_ids)

    if not tags and not paths:
        return

    payload = {'tags': tags, 'paths': paths}
    headers = {'X-Revalidate-Secret': secret}
    try:
        response = requests.post(
            f'{site_url}/api/revalidate',
            json=payload,
            headers=headers,
            timeout=10,
        )
        if response.status_code != 200:
            logger.warning(
                'Revalidation request returned %s: %s',
                response.status_code,
                response.text[:200],
            )
        else:
            logger.info(
                'Revalidation sent to %s for tags=%s paths=%s',
                site_url,
                tags,
                paths,
            )
    except Exception:
        logger.exception('Failed to revalidate frontend at %s', site_url)
