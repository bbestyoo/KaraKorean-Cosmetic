export type MetaEventName =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'AddToWishlist'
  | 'Search'
  | 'Contact';

export type MetaCustomData = Record<string, unknown>;

export interface MetaUserData {
  email?: string;
  phone?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  date_of_birth?: string;
  fb_login_id?: string;
  external_id?: string;
  user_agent?: string;
}

interface MetaEventOptions {
  eventId?: string;
  server?: boolean;
  userData?: MetaUserData;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID || '').trim();
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/shop\/?$/, '');

const FBP_COOKIE = '_fbp';
const FBC_COOKIE = '_fbc';
const EXTERNAL_ID_KEY = 'kara_meta_external_id';
const EXTERNAL_ID_COOKIE = 'kara_eid';
const AUTH_STORAGE_KEY = 'amakonana_auth';
const COOKIE_MAX_AGE_DAYS = 90;

export const META_PIXEL_ENABLED = Boolean(PIXEL_ID);

export function createMetaEventId(prefix = 'event') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getMetaCookie(name: string) {
  if (typeof document === 'undefined') return undefined;

  const match = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) return undefined;

  try {
    return decodeURIComponent(match.slice(name.length + 1));
  } catch {
    return match.slice(name.length + 1);
  }
}

function setMetaCookie(name: string, value: string, days = COOKIE_MAX_AGE_DAYS) {
  if (typeof document === 'undefined') return;

  const maxAge = Math.floor(days * 24 * 60 * 60);
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function createRandomId(length = 13) {
  let value = '';
  for (let i = 0; i < length; i += 1) {
    value += Math.floor(Math.random() * 10);
  }
  return value;
}

/**
 * Returns the browser ID (`_fbp`) Meta expects. The Pixel normally creates this,
 * but server-side events can arrive before the Pixel has run (or when the Pixel
 * is blocked), so we create a spec-compliant fallback and persist it.
 */
export function getMetaFbp() {
  if (typeof window === 'undefined') return undefined;

  const existing = getMetaCookie(FBP_COOKIE);
  if (existing) return existing;

  const value = `fb.1.${Date.now()}.${createRandomId()}`;
  setMetaCookie(FBP_COOKIE, value);
  return value;
}

/**
 * Returns the click ID (`_fbc`). Meta can only build this from `fbclid`, so we
 * capture it as soon as a visitor lands on an ad URL and keep it for later
 * events such as AddToCart and Purchase.
 */
export function getMetaFbc() {
  if (typeof window === 'undefined') return undefined;

  const existing = getMetaCookie(FBC_COOKIE);

  let fbclid: string | null = null;
  try {
    fbclid = new URLSearchParams(window.location.search).get('fbclid');
  } catch {
    fbclid = null;
  }

  if (fbclid) {
    if (existing && existing.endsWith(`.${fbclid}`)) return existing;
    const value = `fb.1.${Date.now()}.${fbclid}`;
    setMetaCookie(FBC_COOKIE, value);
    return value;
  }

  return existing;
}

/**
 * Stable anonymous identifier for Conversions API matching. This is hashed by
 * the backend before it is sent to Meta.
 */
export function getMetaExternalId() {
  if (typeof window === 'undefined') return undefined;

  try {
    const stored = window.localStorage.getItem(EXTERNAL_ID_KEY);
    if (stored) return stored;

    const value = createMetaEventId('kara');
    window.localStorage.setItem(EXTERNAL_ID_KEY, value);
    setMetaCookie(EXTERNAL_ID_COOKIE, value, 365);
    return value;
  } catch {
    return getMetaCookie(EXTERNAL_ID_COOKIE);
  }
}

/**
 * Persist `_fbp` and `_fbc` early (on every route change) so later events and
 * the order payload can use them even if the Pixel is slow or blocked.
 */
export function captureMetaBrowserIds() {
  getMetaFbp();
  getMetaFbc();
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return {};

    const stored = JSON.parse(raw);
    let token = stored?.token;
    if (token && typeof token === 'object') {
      token = token.access || token.token || token.auth_token;
    }
    if (typeof token !== 'string' || !token) return {};

    return {
      Authorization: token.includes('.') ? `Bearer ${token}` : `Token ${token}`,
    };
  } catch {
    return {};
  }
}

export function reportMetaServerEvent({
  eventName,
  eventId,
  customData,
  userData,
}: {
  eventName: MetaEventName;
  eventId: string;
  customData: MetaCustomData;
  userData?: MetaUserData;
}) {
  if (!API_ORIGIN || typeof window === 'undefined') return;

  fetch(`${API_ORIGIN}/cart/api/meta/event/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    keepalive: true,
    body: JSON.stringify({
      ...userData,
      event_name: eventName,
      event_id: eventId,
      custom_data: customData,
      event_source_url: window.location.href,
      fbp: getMetaFbp(),
      fbc: getMetaFbc(),
      external_id: userData?.external_id || getMetaExternalId(),
      user_agent: userData?.user_agent || window.navigator.userAgent,
    }),
  }).catch(() => {});
}

export function trackMetaEvent(
  eventName: MetaEventName,
  customData: MetaCustomData = {},
  options: MetaEventOptions = {}
) {
  const eventId = options.eventId || createMetaEventId(eventName);

  if (META_PIXEL_ENABLED && typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, customData, { eventID: eventId });
  }

  if (options.server !== false) {
    reportMetaServerEvent({
      eventName,
      eventId,
      customData,
      userData: options.userData,
    });
  }

  return eventId;
}
