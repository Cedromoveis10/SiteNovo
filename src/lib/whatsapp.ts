import { siteConfig, type Showroom } from "@/config/site";
import type { Product } from "@/data/types";

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function toE164Digits(value: string): string {
  const phone = digitsOnly(value);
  if (!phone) return "";
  return phone.startsWith("55") ? phone : `55${phone}`;
}

export function getWhatsAppNumber(): string {
  return toE164Digits(siteConfig.whatsappNumber);
}

export function whatsappUrl(message: string, number = getWhatsAppNumber()): string {
  const phone = toE164Digits(number);
  if (!phone) return "/orcamento";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function telHref(value: string): string | undefined {
  const phone = toE164Digits(value);
  return phone ? `tel:+${phone}` : undefined;
}

export function showroomTelHref(showroom: Showroom): string | undefined {
  return showroom.phone ? telHref(showroom.phone) : undefined;
}

export function showroomWhatsAppHref(showroom: Showroom, message?: string): string | undefined {
  if (!showroom.whatsappNumber) return undefined;
  return whatsappUrl(message || specialistMessage(showroom), showroom.whatsappNumber);
}

export function showroomPrimaryAction(
  showroom: Showroom,
  message: string,
): {
  href: string;
  target?: "_blank";
  rel?: "noreferrer";
  channel: "whatsapp" | "phone" | "form";
  label: string;
} {
  if (showroom.whatsappNumber) {
    return {
      href: whatsappUrl(message, showroom.whatsappNumber),
      target: "_blank",
      rel: "noreferrer",
      channel: "whatsapp",
      label: "Continuar no WhatsApp",
    };
  }

  const tel = showroomTelHref(showroom);
  if (tel) {
    return {
      href: tel,
      channel: "phone",
      label: "Ligar para o showroom",
    };
  }

  return {
    href: "/orcamento",
    channel: "form",
    label: "Solicitar orçamento",
  };
}

export function productQuoteMessage(product: Product, showroom?: Showroom): string {
  return [
    `Olá! Gostaria de um orçamento para o produto ${product.name}.`,
    showroom
      ? `Prefiro o atendimento pelo ${showroom.name}, por ser o mais próximo.`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function listQuoteMessage(
  productNames: string[],
  extras?: { name?: string; phone?: string; message?: string; showroom?: Showroom },
): string {
  const items =
    productNames.length > 0
      ? `Gostaria de um orçamento para:\n${productNames.map((name) => `• ${name}`).join("\n")}`
      : "Gostaria de solicitar um orçamento.";
  const note = extras?.message?.trim();

  return [
    extras?.name ? `Olá! Meu nome é ${extras.name}.` : "Olá! Vim pelo site.",
    items,
    extras?.showroom
      ? `Prefiro o ${extras.showroom.name}, por ser o mais próximo.`
      : null,
    extras?.phone ? `Telefone para contato: ${extras.phone}` : null,
    note ? `Mensagem:\n${note}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function specialistMessage(showroom?: Showroom): string {
  return showroom
    ? `Olá! Vim pelo site e gostaria de falar com um especialista do ${showroom.name}.`
    : "Olá! Vim pelo site e gostaria de falar com um especialista.";
}

export function visitMessage(showroomName?: string): string {
  return showroomName
    ? `Olá! Vim pelo site e gostaria de agendar uma visita ao ${showroomName}.`
    : "Olá! Vim pelo site e gostaria de agendar uma visita ao showroom.";
}

export function getShowroomById(id: string | undefined): Showroom | undefined {
  return siteConfig.showrooms.find((showroom) => showroom.id === id);
}
