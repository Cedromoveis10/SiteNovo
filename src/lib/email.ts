import nodemailer from "nodemailer";
import { getShowroomById } from "@/lib/whatsapp";

export type QuoteLead = {
  name: string;
  phone: string;
  showroomId: string;
  items: string[];
  message?: string;
  company?: string;
};

const GMAIL_USER = process.env.GMAIL_USER || "cedromoveistablets@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildQuoteEmail(lead: QuoteLead) {
  const showroom = getShowroomById(lead.showroomId);
  const to = showroom?.email || "contato@cedromoveis.com.br";
  const showroomName = showroom?.name || "Showroom Cedro";
  const items =
    lead.items.length > 0
      ? lead.items.map((item) => `• ${item}`).join("\n")
      : "Nenhuma peça selecionada no site.";
  const itemsHtml =
    lead.items.length > 0
      ? `<ul>${lead.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "<p>Nenhuma peça selecionada no site.</p>";

  const note = lead.message?.trim() || "";
  const subject = `Novo orçamento pelo site — ${showroomName}`;
  const text = [
    "Novo pedido de orçamento pelo site Cedro.",
    "",
    `Showroom: ${showroomName}`,
    `Nome: ${lead.name}`,
    `Telefone para contato: ${lead.phone}`,
    "",
    "Peças de interesse:",
    items,
    note ? `\nMensagem:\n${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <h2>Novo pedido de orçamento</h2>
    <p>Chegou um lead pelo site da Cedro.</p>
    <p><strong>Showroom:</strong> ${escapeHtml(showroomName)}</p>
    <p><strong>Nome:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Telefone para contato:</strong> ${escapeHtml(lead.phone)}</p>
    <p><strong>Peças de interesse:</strong></p>
    ${itemsHtml}
    ${note ? `<p><strong>Mensagem:</strong></p><p>${escapeHtml(note).replaceAll("\n", "<br>")}</p>` : ""}
  `;

  return { to, subject, text, html, showroomName };
}

function getTransporter() {
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  if (!pass) {
    throw new Error("GMAIL_APP_PASSWORD não configurada.");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass,
    },
  });
}

export async function sendQuoteEmail(lead: QuoteLead): Promise<void> {
  const email = buildQuoteEmail(lead);
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `Cedro Móveis <${GMAIL_USER}>`,
    to: email.to,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
}
