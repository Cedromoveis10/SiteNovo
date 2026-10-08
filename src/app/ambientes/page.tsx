import type { Metadata } from "next";
import { EnvironmentCard } from "@/components/environment/EnvironmentCard";
import { Breadcrumbs } from "@/components/ui/Section";
import { environments } from "@/data/taxonomy";

export const metadata: Metadata = {
  title: "Ambientes",
  description:
    "Explore a coleção Cedro a partir do ambiente: sala de estar, cozinha e gourmet.",
  alternates: { canonical: "/ambientes" },
};

export default function EnvironmentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Ambientes" },
        ]}
      />
      <div className="mt-8 max-w-2xl">
        <p className="eyebrow">Explorar</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
          Ambientes
        </h1>
        <p className="mt-5 text-muted">
          Comece pelo espaço. A coleção atual reúne peças para a sala de estar, a cozinha e o gourmet.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {environments.map((environment) => (
          <EnvironmentCard key={environment.slug} environment={environment} />
        ))}
      </div>
    </div>
  );
}
