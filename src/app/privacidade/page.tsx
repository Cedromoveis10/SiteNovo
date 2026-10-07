import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <p className="eyebrow">Institucional</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight">
        Política de privacidade
      </h1>
      <div className="mt-10 space-y-6 text-[1.02rem] leading-8 text-muted">
        <p>
          A {siteConfig.legalName} utiliza os dados informados em formulários e conversas de
          WhatsApp exclusivamente para atendimento, elaboração de propostas e agendamento de visitas
          aos showrooms.
        </p>
        <p>
          Não comercializamos dados pessoais. Informações como nome, telefone, e-mail e cidade são
          usadas apenas no contexto da solicitação de orçamento ou do contato iniciado pelo visitante.
        </p>
        <p>
          O site pode empregar ferramentas de medição de audiência, quando configuradas, para
          compreender o uso das páginas. Identificadores de analytics permanecem desativados até que
          sejam inseridos nas variáveis de ambiente do projeto.
        </p>
        <p>
          Para dúvidas sobre dados pessoais, utilize os canais de contato publicados na página de
          showroom.
        </p>
      </div>
    </article>
  );
}
