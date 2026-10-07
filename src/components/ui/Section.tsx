import Link from "next/link";
import { cn } from "@/lib/utils";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="text-[0.72rem] tracking-[0.14em] uppercase text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center")}>
      {eyebrow ? (
        <p className={cn("eyebrow mb-4", light && "text-stone")}>{eyebrow}</p>
      ) : null}
      <h2
        className={cn(
          "font-display text-4xl leading-[1.05] tracking-tight md:text-5xl",
          light ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      {copy ? (
        <p
          className={cn(
            "mt-5 max-w-xl text-[0.98rem] leading-7",
            align === "center" && "mx-auto",
            light ? "text-stone" : "text-muted",
          )}
        >
          {copy}
        </p>
      ) : null}
    </div>
  );
}
