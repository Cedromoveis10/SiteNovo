"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function ProductBackLink({
  href,
  categoryName,
  className,
}: {
  href: string;
  categoryName: string;
  className?: string;
}) {
  const router = useRouter();

  function goBack() {
    try {
      const referrer = document.referrer;
      if (referrer && new URL(referrer).origin === window.location.origin) {
        router.back();
        return;
      }
    } catch {
      // Fall through to the category page.
    }
    router.push(href);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={cn(
        "inline-flex items-center gap-2 text-[0.75rem] tracking-[0.08em] text-muted uppercase transition-colors hover:text-ink",
        className,
      )}
      aria-label={`Voltar para ${categoryName}`}
    >
      <span aria-hidden="true">←</span>
      Voltar
    </button>
  );
}
