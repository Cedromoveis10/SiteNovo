import { NextResponse } from "next/server";
import { sendQuoteEmail } from "@/lib/email";
import { insertQuoteLead } from "@/lib/leads";
import { products } from "@/lib/products";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getShowroomById } from "@/lib/whatsapp";

export const runtime = "nodejs";

const NAME_MAX = 80;
const MESSAGE_MAX = 2000;
const ITEMS_MAX = 30;
const GENERIC_ERROR = "Não foi possível enviar o orçamento.";

const catalogNames = new Set(products.map((product) => product.name));

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request), 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde um pouco e tente de novo." },
      { status: 429 },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > 20_000) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const data = payload as Record<string, unknown>;

  if (typeof data.company === "string" && data.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = sanitizeLine(data.name, NAME_MAX);
  const phoneDigits = String(data.phone ?? "").replace(/\D/g, "");
  const showroomId = sanitizeLine(data.showroomId, 40);
  const message = sanitizeMultiline(data.message, MESSAGE_MAX);
  const items = Array.isArray(data.items)
    ? data.items
        .map((item) => sanitizeLine(item, 120))
        .filter((item) => catalogNames.has(item))
        .slice(0, ITEMS_MAX)
    : [];

  if (name.length < 2 || phoneDigits.length < 10 || phoneDigits.length > 15) {
    return NextResponse.json(
      { error: "Informe nome e telefone para contato válidos." },
      { status: 400 },
    );
  }

  if (!getShowroomById(showroomId)) {
    return NextResponse.json(
      { error: "Selecione o showroom mais próximo." },
      { status: 400 },
    );
  }

  const lead = {
    name,
    phone: String(data.phone ?? "").trim().slice(0, 20),
    showroomId,
    items,
    message,
  };

  try {
    try {
      await insertQuoteLead(lead, "orcamento_page");
    } catch (error) {
      console.error(
        "quote_leads insert failed",
        error instanceof Error ? error.message : error,
      );
    }

    await sendQuoteEmail(lead);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
  }
}

function sanitizeLine(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function sanitizeMultiline(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F<>]/g, "")
    .trim()
    .slice(0, max);
}
