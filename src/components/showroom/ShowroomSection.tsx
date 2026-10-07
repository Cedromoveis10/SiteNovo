"use client";

import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { ShowroomWhatsAppLink } from "@/components/showroom/ShowroomWhatsAppLink";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";
import { formatAddress, instagramHref } from "@/lib/utils";
import { showroomPrimaryAction, visitMessage } from "@/lib/whatsapp";

export function ShowroomSection({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {siteConfig.showrooms.map((showroom) => {
        const visit = showroomPrimaryAction(showroom, visitMessage(showroom.name));

        return (
          <article key={showroom.id} className="border border-line bg-paper p-8 md:p-10">
            <p className="eyebrow">Florianópolis</p>
            <h3 className="mt-3 font-display text-3xl tracking-tight">{showroom.name}</h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
              {formatAddress(showroom)}
            </p>
            <dl className="mt-6 space-y-2 text-sm">
              {showroom.phone ? (
                <div>
                  <dt className="sr-only">WhatsApp</dt>
                  <dd>
                    <ShowroomWhatsAppLink showroom={showroom} />
                  </dd>
                </div>
              ) : null}
              {showroom.instagram ? (
                <div>
                  <dt className="sr-only">Instagram</dt>
                  <dd>
                    <TrackedAnchor
                      href={instagramHref(showroom.instagram)}
                      event="click_instagram"
                      params={{ account: showroom.instagram, showroom: showroom.id }}
                      className="hover:text-ink"
                    >
                      Instagram @{showroom.instagram}
                    </TrackedAnchor>
                  </dd>
                </div>
              ) : null}
              {showroom.hours.map((item) => (
                <div key={item.days}>
                  <dt className="sr-only">Horário</dt>
                  <dd>
                    {item.days}: {item.time}
                  </dd>
                </div>
              ))}
            </dl>
            {!compact ? (
              <div className="mt-6 aspect-[16/10] overflow-hidden bg-white">
                <iframe
                  title={`Mapa do ${showroom.name}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(showroom.mapsQuery)}&z=16&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={visit.href}
                className="btn btn-primary"
                target={visit.target}
                rel={visit.rel}
                onClick={() =>
                  track("click_showroom", { showroom: showroom.id, action: "visit" })
                }
              >
                Agendar visita
              </a>
              <a
                href={showroom.mapsUrl}
                className="btn btn-secondary"
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  track("click_showroom", { showroom: showroom.id, action: "map" })
                }
              >
                Ver no mapa
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
