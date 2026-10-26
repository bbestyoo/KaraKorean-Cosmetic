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

interface MetaEventOptions {
  eventId?: string;
  server?: boolean;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID || '').trim();
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/shop\/?$/, '');

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

export function reportMetaServerEvent({
  eventName,
  eventId,
  customData,
}: {
  eventName: MetaEventName;
  eventId: string;
  customData: MetaCustomData;
}) {
  if (!API_ORIGIN || typeof window === 'undefined') return;

  fetch(`${API_ORIGIN}/cart/api/meta/event/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      custom_data: customData,
      event_source_url: window.location.href,
      fbp: getMetaCookie('_fbp'),
      fbc: getMetaCookie('_fbc'),
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
    reportMetaServerEvent({ eventName, eventId, customData });
  }

  return eventId;
}
