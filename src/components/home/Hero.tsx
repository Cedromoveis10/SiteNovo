import Image from "next/image";
import Link from "next/link";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-white"
      aria-label="Cedro em Florianópolis"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/videos/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/28 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/25" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-36 pt-32 md:justify-center md:px-8 md:pb-24">
        <div className="max-w-xl reveal">
          <p className="eyebrow text-cedar">Cedro · Florianópolis</p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight text-white md:text-7xl">
            Design que transforma ambientes.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/70">
            Uma curadoria de móveis para ambientes que valorizam design, qualidade e personalidade.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/produtos" className="btn btn-light">
              Conheça a coleção
            </Link>
            <Link href="/orcamento" className="btn btn-gold">
              Solicitar orçamento
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
