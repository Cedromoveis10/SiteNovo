"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProductImage } from "@/data/types";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = images[active] ?? images[0];

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
      if (event.key === "ArrowRight") setActive((value) => (value + 1) % images.length);
      if (event.key === "ArrowLeft") {
        setActive((value) => (value - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed, images.length]);

  if (!current) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="group relative block aspect-square w-full overflow-hidden bg-white"
        aria-label={`Ampliar imagem de ${name}`}
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-[1.04] md:p-12"
        />
        <span className="pointer-events-none absolute right-4 bottom-4 text-[0.68rem] tracking-[0.16em] text-muted uppercase opacity-0 transition-opacity group-hover:opacity-100">
          Ampliar
        </span>
      </button>

      {images.length > 1 ? (
        <div className="mt-4 flex gap-3">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver imagem ${index + 1} de ${name}`}
              aria-current={index === active ? true : undefined}
              className={cn(
                "relative h-20 w-20 overflow-hidden bg-white",
                index === active ? "ring-1 ring-ink" : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image.src} alt="" fill className="object-contain p-2" sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}

      {zoomed ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/92 p-6"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-[0.72rem] tracking-[0.18em] text-paper uppercase"
            onClick={() => setZoomed(false)}
          >
            Fechar
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
