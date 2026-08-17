"""
On-demand ISR revalidation for the Next.js frontend.

Any time a Product (or a related model that affects how products render) is
saved or deleted in Django, we notify the frontend so it invalidates its
ISR cache immediately instead of waiting for the time-based revalidate window.

Output goes to sys.stderr because gevent workers buffer stdout even when
PYTHONUNBUFFERED=1 is set.  sys.stderr is never buffered by Python or gevent.
"""
import sys

import requests
from django.conf import settings


def _log(msg):
    sys.stderr.write(f"{msg}\n")
    sys.stderr.flush()


def revalidate_frontend(*, tags=None, paths=None, product_ids=None):
    """Tell the Next.js frontend to revalidate the given ISR tags/paths."""
    secret = getattr(settings, 'REVALIDATE_SECRET', None)
    site_url = (getattr(settings, 'FRONTEND_URL', None) or '').rstrip('/')

    if not secret or not site_url:
        _log(
            f"[ISR] SKIP — REVALIDATE_SECRET={'set' if secret else 'MISSING'}  "
            f"FRONTEND_URL={site_url!r}"
        )
        return

    tags = list(tags or [])
    paths = list(paths or [])
    if product_ids:
        paths.extend(f'/products/{pid}' for pid in product_ids)

    if not tags and not paths:
        _log("[ISR] SKIP — no tags or paths to revalidate")
        return

    payload = {'tags': tags, 'paths': paths}
    url = f'{site_url}/api/revalidate'
    _log(f"[ISR] POST {url}  payload={payload}")

    try:
        resp = requests.post(
            url,
            json=payload,
            headers={'X-Revalidate-Secret': secret},
            timeout=10,
        )
        _log(f"[ISR] Response {resp.status_code}: {resp.text[:300]}")
    except Exception as exc:
        _log(f"[ISR] FAILED — {exc}")
