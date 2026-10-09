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
    fbq?: (...args: unknown[]) => void;
  }
}

const gaEvents: Partial<Record<AnalyticsEvent, string>> = {
  view_product: "view_item",
  view_category: "view_item_list",
  select_product: "select_item",
  add_to_quote: "add_to_cart",
  begin_quote: "begin_checkout",
  submit_quote: "generate_lead",
  click_whatsapp: "generate_lead",
  click_showroom: "generate_lead",
};

const metaEvents: Partial<Record<AnalyticsEvent, string>> = {
  view_product: "ViewContent",
  view_category: "ViewContent",
  add_to_quote: "AddToCart",
  begin_quote: "InitiateCheckout",
  submit_quote: "Lead",
  click_whatsapp: "Contact",
  click_showroom: "Contact",
};

function metaParams(event: AnalyticsEvent, params: EventParams) {
  const content_ids = params.item_id ? [String(params.item_id)] : undefined;
  const content_name = params.item_name ? String(params.item_name) : undefined;
  const content_category = params.item_category
    ? String(params.item_category)
    : undefined;

  if (event === "view_product" || event === "add_to_quote") {
    return {
      content_ids,
      content_name,
      content_type: "product",
      content_category,
    };
  }

  if (event === "view_category") {
    return { content_category, content_type: "product_group" };
  }

  return {
    content_name,
    content_category,
    source: params.source,
    showroom: params.showroom,
  };
}

function gaParams(event: AnalyticsEvent, params: EventParams) {
  const payload: Record<string, unknown> = {};
  const method =
    event === "click_whatsapp"
      ? "whatsapp"
      : event === "click_showroom"
        ? "showroom"
        : event === "submit_quote"
          ? "form"
          : params.source;
  const leadSource = params.source ?? params.action;

  if (method) payload.method = method;
  if (leadSource) payload.lead_source = leadSource;
  if (params.showroom) payload.showroom = params.showroom;
  if (params.item_category) payload.item_list_name = params.item_category;

  if (
    event !== "submit_quote" &&
    event !== "click_whatsapp" &&
    event !== "click_showroom" &&
    (params.item_id || params.item_name)
  ) {
    payload.items = [
      {
        item_id: params.item_id,
        item_name: params.item_name,
        item_category: params.item_category,
      },
    ];
  }

  return payload;
}

export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  if (typeof window.gtag === "function") {
    const gaEvent = gaEvents[event] ?? event;
    window.gtag("event", gaEvent, gaParams(event, params));
  }

  const metaEvent = metaEvents[event];
  if (metaEvent && typeof window.fbq === "function") {
    window.fbq("track", metaEvent, metaParams(event, params));
  }
}
