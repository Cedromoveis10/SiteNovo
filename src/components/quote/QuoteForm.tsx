"use client";

import { useMemo, useState } from "react";
import { siteConfig } from "@/config/site";
import { useQuote } from "@/context/QuoteProvider";
import { track } from "@/lib/analytics";
import type { QuoteLead } from "@/lib/email";
import { cn } from "@/lib/utils";
import {
  getShowroomById,
  listQuoteMessage,
  whatsappUrl,
} from "@/lib/whatsapp";

const SHOWROOM_REQUIRED = "Selecione uma das duas unidades para continuar.";

export function QuoteForm({
  source = "form",
}: {
  defaultInterest?: string;
  source?: string;
}) {
  const { items } = useQuote();
  const [showroomId, setShowroomId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [showroomError, setShowroomError] = useState(false);
  const selectedShowroom = getShowroomById(showroomId);
  const productNames = useMemo(() => items.map((item) => item.name), [items]);

  function validate() {
    if (!selectedShowroom) {
      setShowroomError(true);
      setError(SHOWROOM_REQUIRED);
      return false;
    }
    if (name.trim().length < 2) {
      setShowroomError(false);
      setError("Informe seu nome.");
      return false;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setShowroomError(false);
      setError("Informe um telefone para contato válido.");
      return false;
    }
    setShowroomError(false);
    setError("");
    return true;
  }

  async function tryServerSend(lead: QuoteLead): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);
      const response = await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: controller.signal,
      });
      window.clearTimeout(timeout);
      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
      } | null;
      return response.ok && Boolean(result?.ok);
    } catch {
      return false;
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate() || !selectedShowroom) return;

    const lead: QuoteLead = {
      name: name.trim(),
      phone: phone.trim(),
      showroomId: selectedShowroom.id,
      items: productNames,
      message: message.trim(),
    };

    setStatus("sending");
    setError("");

    const delivered = await tryServerSend(lead);
    if (!delivered) {
      setStatus("idle");
      setError("Não foi possível enviar o orçamento. Tente de novo em instantes.");
      return;
    }

    track("submit_quote", {
      source,
      item_count: items.length,
      showroom: selectedShowroom.id,
      channel: "email",
    });
    setStatus("sent");
  }

  function onWhatsApp() {
    if (!validate() || !selectedShowroom) return;

    const text = listQuoteMessage(productNames, {
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      showroom: selectedShowroom,
    });
    const number = selectedShowroom.whatsappNumber || siteConfig.whatsappNumber;
    const href = whatsappUrl(text, number);

    track("click_whatsapp", {
      source,
      item_count: items.length,
      showroom: selectedShowroom.id,
    });

    window.open(href, "_blank", "noopener,noreferrer");
  }

  if (status === "sent") {
    return (
      <div className="border border-line px-6 py-8">
        <p className="font-display text-3xl tracking-tight">Pedido enviado.</p>
        <p className="mt-3 text-sm leading-6 text-muted">
          Recebemos seus dados. Um especialista do showroom mais próximo entra em contato em breve.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <fieldset
        className={cn(
          "border px-3 py-3 md:px-4 md:py-4",
          showroomError ? "border-cedar-deep" : "border-ink/20",
        )}
      >
        <legend className="px-1 font-display text-xl tracking-tight">
          Qual showroom fica mais perto?
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {siteConfig.showrooms.map((showroom) => {
            const selected = showroomId === showroom.id;
            return (
              <label
                key={showroom.id}
                className={cn(
                  "relative flex cursor-pointer items-start gap-3 border p-3",
                  selected ? "border-ink" : "border-line hover:border-ink",
                )}
                style={
                  selected
                    ? { backgroundColor: "var(--ink)", color: "#ffffff" }
                    : { backgroundColor: "#ffffff", color: "var(--ink)" }
                }
              >
                <input
                  type="radio"
                  name="showroom"
                  value={showroom.id}
                  required
                  checked={selected}
                  onChange={() => {
                    setShowroomId(showroom.id);
                    setShowroomError(false);
                    if (error === SHOWROOM_REQUIRED) {
                      setError("");
                    }
                  }}
                  className="sr-only"
                />
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                  style={{
                    borderColor: selected ? "#ffffff" : "rgba(26, 22, 18, 0.35)",
                    backgroundColor: "#ffffff",
                  }}
                  aria-hidden
                >
                  {selected ? (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "var(--ink)" }}
                    />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-lg tracking-tight md:text-xl">
                    {showroom.name.replace(/^Showroom\s+/i, "")}
                  </span>
                  <span
                    className="mt-0.5 block text-sm"
                    style={{ color: selected ? "rgba(255,255,255,0.72)" : "var(--muted)" }}
                  >
                    {showroom.neighborhood}
                  </span>
                  <span
                    className="mt-0.5 hidden text-xs leading-5 sm:block"
                    style={{ color: selected ? "rgba(255,255,255,0.62)" : "var(--muted)" }}
                  >
                    {showroom.street}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <p
          className={cn(
            "mt-2 text-sm",
            showroomError ? "text-cedar-deep" : "text-muted",
          )}
        >
          {selectedShowroom
            ? `Atendimento pelo ${selectedShowroom.name}.`
            : "Toque em Estreito ou SC-401 para escolher."}
        </p>
      </fieldset>

      <div className="grid grid-cols-2 items-end gap-4">
        <label className="block">
          <span className="eyebrow">Nome *</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field mt-1 !py-2"
          />
        </label>

        <label className="block">
          <span className="eyebrow leading-tight">
            <span className="sm:hidden">Telefone *</span>
            <span className="hidden sm:inline">Telefone para contato *</span>
          </span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="field mt-1 !py-2"
          />
        </label>
      </div>

      <label className="block">
        <span className="eyebrow">Mensagem (opcional)</span>
        <textarea
          name="message"
          rows={2}
          maxLength={2000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Medidas, ambiente, acabamento ou qualquer detalhe que queira compartilhar."
          className="mt-1.5 min-h-[4.5rem] w-full resize-y border border-line bg-transparent px-3 py-2 text-sm leading-6 text-ink placeholder:text-muted/70"
        />
      </label>

      {error ? <p className="text-sm text-cedar-deep">{error}</p> : null}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="submit"
          className="btn btn-primary w-full px-3 text-center leading-tight"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Enviando..." : "Solicitar orçamento"}
        </button>
        <button
          type="button"
          className="btn btn-secondary w-full px-3 text-center leading-tight"
          onClick={onWhatsApp}
          disabled={status === "sending"}
        >
          <span className="sm:hidden">WhatsApp</span>
          <span className="hidden sm:inline">Continuar pelo WhatsApp</span>
        </button>
      </div>
    </form>
  );
}
