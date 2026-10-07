import { NextResponse } from "next/server";
import { sendQuoteEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import { getShowroomById } from "@/lib/whatsapp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const data = payload as {
    name?: string;
    phone?: string;
    showroomId?: string;
    items?: unknown;
    message?: string;
  };

  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").trim();
  const showroomId = String(data.showroomId || "").trim();
  const message = String(data.message || "").trim().slice(0, 2000);
  const items = Array.isArray(data.items)
    ? data.items.map((item) => String(item).trim()).filter(Boolean)
    : [];

  if (name.length < 2 || phone.replace(/\D/g, "").length < 10) {
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

  try {
    const supabase = createClient();
    const { error } = await supabase.from("quote_leads").insert({
      name,
      phone,
      showroom_id: showroomId,
      items,
      message: message || null,
      source: "orcamento_page",
    });
    if (error) {
      console.error("quote_leads insert failed", error.message);
    }

    await sendQuoteEmail({ name, phone, showroomId, items, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível enviar o orçamento.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
