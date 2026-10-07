export type AnalyticsEvent =
  | "view_product"
  | "view_category"
  | "select_product"
  | "add_to_quote"
  | "remove_from_quote"
  | "begin_quote"
  | "submit_quote"
  | "click_whatsapp"
  | "click_showroom"
  | "click_instagram";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}
