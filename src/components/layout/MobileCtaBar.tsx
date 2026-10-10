"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { StoreChoiceButton } from "@/components/quote/StorePicker";
import { track } from "@/lib/analytics";
import { specialistMessage } from "@/lib/whatsapp";

export function FloatingCtas() {
  const pathname = usePathname();
  if (pathname === "/orcamento") return null;

  return (
    <div className="fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-30 flex items-center gap-2">
      <Link
        href="/orcamento"
        onClick={() => track("begin_quote", { source: "mobile_bar" })}
        className="inline-flex h-12 items-center rounded-full bg-ink px-5 text-[0.7rem] font-medium tracking-[0.12em] text-paper uppercase shadow-[0_12px_32px_rgba(26,22,18,0.28)] md:hidden"
      >
        Orçamento
      </Link>
      <StoreChoiceButton
        source="floating"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-cedar/40 bg-ink text-cedar shadow-[0_12px_32px_rgba(26,22,18,0.28)] transition-colors hover:bg-cedar hover:text-ink"
        buildMessage={(showroom) => specialistMessage(showroom)}
      >
        <span className="sr-only">Falar no WhatsApp</span>
        <WhatsAppIcon className="h-5 w-5" />
      </StoreChoiceButton>
    </div>
  );
}
