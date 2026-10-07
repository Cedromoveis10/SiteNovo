import type { Metadata } from "next";
import { ShowroomSection } from "@/components/showroom/ShowroomSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Showroom em Florianópolis",
  description:
    "Visite os showrooms Cedro no Estreito e na SC-401, em Florianópolis. Agende uma visita e conheça as peças de perto.",
  alternates: { canonical: "/showroom" },
};

export default function ShowroomPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <JsonLd data={localBusinessJsonLd()} />
      <p className="eyebrow">Florianópolis</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl tracking-tight md:text-6xl">
        Dois showrooms para ver, tocar e escolher.
      </h1>
      <p className="mt-5 max-w-xl text-muted">
        Materiais, proporções e o diálogo entre as peças se revelam no espaço físico. Agende uma visita.
      </p>
      <div className="mt-14">
        <ShowroomSection />
      </div>
    </div>
  );
}
