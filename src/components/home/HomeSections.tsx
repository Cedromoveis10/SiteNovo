import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { EnvironmentCard } from "@/components/environment/EnvironmentCard";
import { ShowroomSection } from "@/components/showroom/ShowroomSection";
import { SectionHeading } from "@/components/ui/Section";
import { SpecialistButton } from "@/components/quote/QuoteButton";
import { environments } from "@/data/taxonomy";
import { getFeaturedProducts } from "@/lib/products";

const steps = [
  {
    n: "01",
    title: "Descubra",
    copy: "Percorra a coleção por peça ou por ambiente, no ritmo de um showroom.",
  },
  {
    n: "02",
    title: "Escolha",
    copy: "Observe materiais, proporções e o diálogo entre as peças.",
  },
  {
    n: "03",
    title: "Consulte",
    copy: "Converse com um especialista sobre acabamentos, medidas e o projeto.",
  },
  {
    n: "04",
    title: "Receba sua proposta",
    copy: "Solicite o orçamento da seleção — com atendimento consultivo, não automático.",
  },
];

export function HomeSections() {
  const featured = getFeaturedProducts().slice(0, 6);
  const highlights = [
    "Qualidade e longevidade",
    "Design contemporâneo",
    "Materiais à vista",
    "Atendimento consultivo",
  ];

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading
          eyebrow="Curadoria"
          title="Uma seleção feita para permanecer."
          copy="A Cedro reúne móveis de alto padrão com atenção ao desenho, aos materiais e ao modo como cada peça ocupa o ambiente. O site é um convite à descoberta — o atendimento continua no showroom e com nossos especialistas."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <li key={item} className="border-t border-line pt-4 text-sm leading-6 text-muted">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-16 grid grid-cols-1 items-stretch gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12">
          <Link href="/produtos" className="btn btn-secondary">
            Ver coleção completa
          </Link>
        </div>
      </section>

      <section className="bg-ink py-24 text-paper md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Ambientes"
            title="Comece pelo espaço."
            copy="Se ainda não há uma peça em mente, explore pelo ambiente."
            light
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {environments.map((environment) => (
              <EnvironmentCard key={environment.slug} environment={environment} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading
          eyebrow="Atendimento"
          title="Do primeiro olhar à escolha final."
          copy="O processo não termina no site. Cada projeto é acompanhado de perto."
        />
        <ol className="mt-16 grid gap-10 md:grid-cols-4">
          {steps.map((step) => (
            <li key={step.n} className="border-t border-line pt-6">
              <p className="font-display text-3xl text-cedar">{step.n}</p>
              <h3 className="mt-4 font-display text-2xl tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{step.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Showroom"
            title="Venha ver as peças de perto."
            copy="Dois endereços em Florianópolis para experimentar materiais, proporções e o ambiente completo."
          />
          <div className="mt-12">
            <ShowroomSection compact />
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-center text-paper md:py-32">
        <div className="mx-auto max-w-3xl px-5">
          <p className="eyebrow text-cedar">Proposta</p>
          <h2 className="mt-5 font-display text-4xl leading-tight tracking-tight md:text-6xl">
            Encontrou a peça ideal para o seu ambiente?
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/orcamento" className="btn btn-light">
              Solicitar orçamento
            </Link>
            <SpecialistButton className="btn-light" source="home_final" />
          </div>
        </div>
      </section>
    </>
  );
}
