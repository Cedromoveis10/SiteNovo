"use client";

import type { AnalyticsEvent } from "@/lib/analytics";
import { track } from "@/lib/analytics";

export function TrackedAnchor({
  href,
  event,
  params,
  className,
  children,
}: {
  href: string;
  event: AnalyticsEvent;
  params?: Record<string, string | number | boolean | undefined>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noreferrer"
      onClick={() => track(event, params)}
    >
      {children}
    </a>
  );
}
