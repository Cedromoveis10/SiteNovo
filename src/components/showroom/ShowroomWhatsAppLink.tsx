"use client";

import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import type { Showroom } from "@/config/site";
import { cn } from "@/lib/utils";
import { showroomWhatsAppHref } from "@/lib/whatsapp";

export function ShowroomWhatsAppLink({
  showroom,
  className,
}: {
  showroom: Showroom;
  className?: string;
}) {
  const href = showroomWhatsAppHref(showroom);
  if (!href || !showroom.phone) return null;

  return (
    <TrackedAnchor
      href={href}
      event="click_whatsapp"
      params={{ showroom: showroom.id, source: "phone_link" }}
      className={cn("inline-flex items-center gap-2 hover:text-cedar", className)}
    >
      <WhatsAppIcon className="h-4 w-4 shrink-0" />
      <span>{showroom.phone}</span>
      <span className="sr-only">(WhatsApp)</span>
    </TrackedAnchor>
  );
}
