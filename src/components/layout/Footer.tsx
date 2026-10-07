import Image from "next/image";
import Link from "next/link";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { ShowroomWhatsAppLink } from "@/components/showroom/ShowroomWhatsAppLink";
import { siteConfig } from "@/config/site";
import { categories, environments } from "@/data/taxonomy";
import { mediaUrl } from "@/lib/media";
import { formatAddress, instagramHref } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-8 md:py-20">
        <div className="md:col-span-1">
          <Image
            src={mediaUrl("/brand/logo-transparent.png")}
            alt="Cedro Móveis & Ambientes"
            width={499}
            height={318}
            className="h-16 w-auto bg-transparent"
            style={{ backgroundColor: "transparent" }}
            unoptimized
          />
          <p className="mt-6 max-w-xs text-sm leading-6 text-stone">
            Curadoria de móveis de alto padrão em Florianópolis, desde {siteConfig.founded}.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4 text-stone">Coleção</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/produtos" className="hover:text-cedar">
                Todos os produtos
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/produtos/${category.slug}`} className="hover:text-cedar">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 text-stone">A marca</p>
          <ul className="space-y-2 text-sm">
            {environments.map((environment) => (
              <li key={environment.slug}>
                <Link href={`/ambientes/${environment.slug}`} className="hover:text-cedar">
                  {environment.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/a-marca" className="hover:text-cedar">
                A Marca
              </Link>
            </li>
            <li>
              <Link href="/showroom" className="hover:text-cedar">
                Showroom
              </Link>
            </li>
            <li>
              <Link href="/orcamento" className="hover:text-cedar">
                Solicitar orçamento
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 text-stone">Contato</p>
          <ul className="space-y-4 text-sm leading-6 text-stone">
            {siteConfig.showrooms.map((showroom) => (
              <li key={showroom.id}>
                <p className="text-paper">{showroom.name}</p>
                <p>{formatAddress(showroom)}</p>
                {showroom.phone ? (
                  <p>
                    <ShowroomWhatsAppLink showroom={showroom} className="text-paper hover:text-cedar" />
                  </p>
                ) : null}
                {showroom.instagram ? (
                  <p>
                    <TrackedAnchor
                      href={instagramHref(showroom.instagram)}
                      event="click_instagram"
                      params={{ account: showroom.instagram, showroom: showroom.id }}
                      className="text-paper hover:text-cedar"
                    >
                      Instagram @{showroom.instagram}
                    </TrackedAnchor>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs tracking-[0.12em] text-stone uppercase md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}</p>
          <Link href="/privacidade" className="hover:text-paper">
            Política de privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
