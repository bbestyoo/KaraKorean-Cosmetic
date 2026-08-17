"""
On-demand ISR revalidation for the Next.js frontend.

Any time a Product (or a related model that affects how products render) is
saved or deleted in Django, we notify the frontend so it invalidates its
ISR cache immediately instead of waiting for the time-based revalidate window.

Output goes to sys.stderr because gevent workers buffer stdout even when
PYTHONUNBUFFERED=1 is set.  sys.stderr is never buffered by Python or gevent.
"""
import sys
import os
from pathlib import Path

import requests
from django.conf import settings


def _log(msg):
    sys.stderr.write(f"{msg}\n")
    sys.stderr.flush()


def _get_secret():
    """Read REVALIDATE_SECRET, falling back to a direct .env file read."""
    # 1. From Django settings / os.environ
    val = getattr(settings, 'REVALIDATE_SECRET', None) or os.environ.get('REVALIDATE_SECRET')
    if val:
        return val

    # 2. Direct .env file read (bypasses dotenv if it failed to parse)
    # Walk up from settings.py → ecommerce/ → backend/ → .env
    env_path = Path(__file__).resolve().parent.parent / '.env'
    if not env_path.exists():
        # Docker volume mount: /app/.env
        env_path = Path('/app/.env')
    if env_path.exists():
        for line in env_path.read_text(encoding='utf-8', errors='replace').splitlines():
            stripped = line.strip()
            if stripped.startswith('REVALIDATE_SECRET='):
                value = stripped.split('=', 1)[1].strip().strip('"').strip("'")
                if value:
                    _log(f"[ISR] DEBUG: read REVALIDATE_SECRET from {env_path}")
                    return value

    return None


def revalidate_frontend(*, tags=None, paths=None, product_ids=None):
    """Tell the Next.js frontend to revalidate the given ISR tags/paths."""
    secret = _get_secret()
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
