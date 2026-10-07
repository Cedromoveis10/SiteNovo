import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShowroomSection } from "@/components/showroom/ShowroomSection";
import { siteConfig } from "@/config/site";
import { mediaUrl } from "@/lib/media";

export const metadata: Metadata = {
  title: "A Marca",
  description:
    "Cedro Móveis & Ambientes. Curadoria de móveis de alto padrão em Florianópolis, desde 1998.",
  alternates: { canonical: "/a-marca" },
};

export default function BrandPage() {
  return (
    <>
      <section className="bg-ink px-5 pt-36 pb-24 text-paper md:px-8 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-cedar">Desde {siteConfig.founded}</p>
          <h1 className="mt-6 font-display text-5xl tracking-tight md:text-7xl">
            Cedro Móveis & Ambientes
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-stone">
            Uma curadoria de móveis para ambientes que valorizam design, qualidade e personalidade.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-8 md:py-32">
        <div>
          <p className="eyebrow">Manifesto</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
            Uma seleção feita para permanecer.
          </h2>
          <p className="mt-6 text-[1.02rem] leading-8 text-muted">
            Desde {siteConfig.founded}, a Cedro constrói em Florianópolis uma experiência em móveis
            de alto padrão. O olhar é de curadoria: peças com desenho, materiais e presença para
            acompanhar o cotidiano — e para serem vistas de perto no showroom.
          </p>
        </div>
        <div className="bg-white p-10 md:p-16">
          <Image
            src={mediaUrl("/brand/logo-transparent.png")}
            alt="Cedro Móveis & Ambientes"
            width={499}
            height={318}
            className="mx-auto h-auto w-64 bg-transparent"
            style={{ backgroundColor: "transparent" }}
            unoptimized
          />
        </div>
      </section>

      <section className="border-t border-line py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-3 md:px-8">
          {[
            {
              title: "Curadoria",
              copy: "Cada peça da coleção é apresentada com o mesmo critério de um showroom: desenho, material e adequação ao ambiente.",
            },
            {
              title: "Qualidade",
              copy: "Madeira, palhinha, tecido e metal aparecem com clareza. O detalhe é parte da escolha — não um acessório.",
            },
            {
              title: "Atendimento",
              copy: "O site inicia a conversa. A proposta nasce no diálogo com um especialista, de acordo com o projeto.",
            },
          ].map((item) => (
            <article key={item.title} className="border-t border-line pt-6">
              <h2 className="font-display text-3xl tracking-tight">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <p className="eyebrow">Showroom</p>
        <h2 className="mt-4 font-display text-4xl tracking-tight">Onde nos encontrar</h2>
        <div className="mt-12">
          <ShowroomSection compact />
        </div>
        <Link href="/showroom" className="btn btn-secondary mt-10">
          Ver showrooms
        </Link>
      </section>
    </>
  );
}
