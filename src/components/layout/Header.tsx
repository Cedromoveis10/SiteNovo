"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/config/site";
import { categories, environments } from "@/data/taxonomy";
import { useQuote } from "@/context/QuoteProvider";
import { categoryLabel, searchProducts } from "@/lib/products";
import { track } from "@/lib/analytics";
import { specialistMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { StoreChoiceButton } from "@/components/quote/StorePicker";
import { mediaUrl } from "@/lib/media";

const nav = [
  { href: "/produtos", label: "Produtos" },
  { href: "/ambientes", label: "Ambientes" },
  { href: "/a-marca", label: "A Marca" },
  { href: "/showroom", label: "Showroom" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useQuote();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const isHome = pathname === "/";
  const results = useMemo(() => searchProducts(query).slice(0, 6), [query]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        solid ? "bg-white shadow-[0_1px_0_var(--line)]" : "bg-transparent transition-colors duration-300",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 md:h-24 md:px-8">
        <Link
          href="/"
          className="site-logo relative z-10 inline-flex shrink-0 cursor-pointer"
          aria-label="Cedro Móveis & Ambientes"
        >
          <Image
            src={mediaUrl("/brand/logo-transparent.png")}
            alt=""
            width={499}
            height={318}
            className="h-12 w-auto bg-transparent md:h-[3.6rem]"
            style={{ backgroundColor: "transparent" }}
            priority
            unoptimized
            draggable={false}
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[12px] font-normal tracking-[-0.01em] transition-colors",
                  solid ? "text-ink/80 hover:text-ink" : "text-paper/80 hover:text-paper",
                  active && (solid ? "text-ink" : "text-paper"),
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className={cn(
              "hidden text-[12px] tracking-[-0.01em] lg:inline",
              solid ? "text-ink/70 hover:text-ink" : "text-paper/80 hover:text-paper",
            )}
            aria-expanded={searchOpen}
            aria-controls="site-search"
          >
            Buscar
          </button>

          <Link
            href="/selecao"
            className={cn(
              "text-[12px] tracking-[-0.01em]",
              solid ? "text-ink/80 hover:text-ink" : "text-paper/80 hover:text-paper",
            )}
          >
            Seleção{items.length > 0 ? ` (${items.length})` : ""}
          </Link>

          <Link
            href="/orcamento"
            onClick={() => track("begin_quote", { source: "header" })}
            className={cn(
              "btn !hidden !min-h-10 !px-4 lg:!inline-flex",
              solid ? "btn-primary" : "btn-light",
            )}
          >
            Solicitar orçamento
          </Link>

          <button
            type="button"
            className={cn(
              "relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden",
              solid ? "text-ink" : "text-paper",
            )}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={cn("h-px w-5 bg-current transition-transform", open && "translate-y-[4px] rotate-45")} />
            <span className={cn("h-px w-5 bg-current transition-opacity", open && "opacity-0")} />
            <span className={cn("h-px w-5 bg-current transition-transform", open && "-translate-y-[4px] -rotate-45")} />
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-line bg-white px-5 py-4 md:px-8">
          <form
            id="site-search"
            className="mx-auto max-w-7xl"
            onSubmit={(event) => {
              event.preventDefault();
              if (query.trim()) router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
            }}
          >
            <label htmlFor="search-input" className="sr-only">
              Buscar produtos
            </label>
            <input
              id="search-input"
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value.slice(0, 80))}
              maxLength={80}
              placeholder="Digite o que procura..."
              className="field text-lg"
            />
            {query && results.length > 0 ? (
              <ul className="mt-3 divide-y divide-line">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/produtos/${product.category}/${product.slug}`}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span>{product.name}</span>
                      <span className="eyebrow">{categoryLabel(product.category)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </form>
        </div>
      ) : null}

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-x-0 bottom-0 top-[4.5rem] z-50 overflow-y-auto overscroll-contain bg-white px-5 pt-5 pb-10 md:top-24 md:px-8 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              <nav className="flex flex-col gap-3" aria-label="Menu mobile">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-display text-2xl leading-tight tracking-tight text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 grid grid-cols-2 gap-6 border-t border-line pt-6">
                <div>
                  <p className="eyebrow mb-3">Coleção</p>
                  <div className="flex flex-col gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/produtos/${category.slug}`}
                        className="text-[0.95rem]"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="eyebrow mb-3">Ambientes</p>
                  <div className="flex flex-col gap-2">
                    {environments.map((environment) => (
                      <Link
                        key={environment.slug}
                        href={`/ambientes/${environment.slug}`}
                        className="text-[0.95rem]"
                      >
                        {environment.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <form
                className="mt-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (query.trim()) router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
                }}
              >
                <label htmlFor="mobile-search" className="sr-only">
                  Buscar
                </label>
                <input
                  id="mobile-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value.slice(0, 80))}
                  maxLength={80}
                  placeholder="Digite o que procura..."
                  className="field"
                />
              </form>
              <div className="mt-6 grid gap-3">
                <Link href="/orcamento" className="btn btn-primary w-full">
                  Solicitar orçamento
                </Link>
                <StoreChoiceButton
                  source="mobile_menu"
                  className="btn btn-secondary w-full"
                  buildMessage={(showroom) => specialistMessage(showroom)}
                >
                  Falar com um especialista
                </StoreChoiceButton>
              </div>
              <p className="mt-6 text-sm text-muted">{siteConfig.legalName}</p>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
