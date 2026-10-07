"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig, type Showroom } from "@/config/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { showroomPrimaryAction } from "@/lib/whatsapp";

export function StoreChoiceButton({
  children,
  className,
  source,
  message,
  buildMessage,
}: {
  children: React.ReactNode;
  className?: string;
  source: string;
  message?: string;
  buildMessage?: (showroom: Showroom) => string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open ? (
        <StorePickerDialog
          source={source}
          message={message}
          buildMessage={buildMessage}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

export function StorePickerDialog({
  source,
  message,
  buildMessage,
  onClose,
}: {
  source: string;
  message?: string;
  buildMessage?: (showroom: Showroom) => string;
  onClose: () => void;
}) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-xl border border-line bg-white p-6 shadow-[0_24px_80px_rgba(26,22,18,0.18)] md:p-8"
      >
        <p className="eyebrow">Atendimento</p>
        <h2 id={titleId} className="mt-3 font-display text-3xl tracking-tight">
          Com qual showroom você quer falar?
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Escolha a unidade para iniciar o atendimento.
        </p>
        <div className="mt-8 grid gap-3">
          {siteConfig.showrooms.map((showroom) => {
            const text =
              buildMessage?.(showroom) ||
              message ||
              `Olá! Vim pelo site e gostaria de atendimento no ${showroom.name}.`;
            const action = showroomPrimaryAction(showroom, text);

            return (
              <a
                key={showroom.id}
                href={action.href}
                target={action.target}
                rel={action.rel}
                className="block border border-line px-5 py-5 text-left transition-colors hover:border-ink"
                onClick={() => {
                  track("click_showroom", {
                    showroom: showroom.id,
                    action: source,
                    channel: action.channel,
                  });
                  onClose();
                }}
              >
                <p className="font-display text-2xl tracking-tight">{showroom.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {showroom.street} — {showroom.neighborhood}
                </p>
                <p className="mt-3 text-[0.72rem] tracking-[0.14em] text-cedar uppercase">
                  {action.channel === "whatsapp" && showroom.whatsapp
                    ? `WhatsApp ${showroom.whatsapp}`
                    : showroom.phone
                      ? showroom.phone
                      : action.label}
                </p>
              </a>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 text-[0.72rem] tracking-[0.14em] text-muted uppercase hover:text-ink"
        >
          Cancelar
        </button>
      </div>
    </div>,
    document.body,
  );
}
