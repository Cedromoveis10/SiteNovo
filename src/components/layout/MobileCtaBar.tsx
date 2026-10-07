"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { StoreChoiceButton } from "@/components/quote/StorePicker";
import { track } from "@/lib/analytics";
import { specialistMessage } from "@/lib/whatsapp";

export function MobileCtaBar() {
  const pathname = usePathname();
  if (pathname === "/orcamento") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <StoreChoiceButton
          source="mobile_bar"
          className="btn btn-secondary !min-h-11"
          buildMessage={(showroom) => specialistMessage(showroom)}
        >
          WhatsApp
        </StoreChoiceButton>
        <Link
          href="/orcamento"
          onClick={() => track("begin_quote", { source: "mobile_bar" })}
          className="btn btn-primary !min-h-11"
        >
          Orçamento
        </Link>
      </div>
    </div>
  );
}

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname === "/orcamento") return null;

  return (
    <StoreChoiceButton
      source="floating"
      className="fixed right-5 bottom-24 z-30 hidden h-12 w-12 items-center justify-center border border-cedar/40 bg-ink text-cedar transition-colors hover:bg-cedar hover:text-ink md:bottom-6 md:flex"
      buildMessage={(showroom) => specialistMessage(showroom)}
    >
      <span className="sr-only">Falar no WhatsApp</span>
      <WhatsAppIcon className="h-5 w-5" />
    </StoreChoiceButton>
  );
}
