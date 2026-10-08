import Image from "next/image";
import Link from "next/link";
import type { Environment } from "@/data/types";
import { environmentPath } from "@/lib/products";

export function EnvironmentCard({ environment }: { environment: Environment }) {
  return (
    <Link href={environmentPath(environment.slug)} className="group relative block overflow-hidden bg-ink">
      <div className="relative aspect-[4/5]">
        <Image
          src={environment.image}
          alt={environment.name}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7 text-paper">
          <p className="eyebrow text-stone">Explorar ambiente</p>
          <h3 className="mt-2 font-display text-3xl tracking-tight">{environment.name}</h3>
        </div>
      </div>
    </Link>
  );
}
