"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getFilterOptions } from "@/lib/products";
import { categoryLabel, environmentLabel } from "@/lib/products";
import type { Product } from "@/data/types";

export function Filters({ products }: { products: Product[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const options = getFilterOptions(products);
  const selected = {
    category: params.get("categoria") ?? "",
    environment: params.get("ambiente") ?? "",
    material: params.get("material") ?? "",
    finish: params.get("acabamento") ?? "",
    collection: params.get("colecao") ?? "",
  };

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    router.push(query ? `?${query}` : "?", { scroll: false });
  }

  const groups = [
    options.categories.length > 1
      ? {
          key: "categoria",
          label: "Categoria",
          value: selected.category,
          items: options.categories.map((slug) => ({
            value: slug,
            label: categoryLabel(slug),
          })),
        }
      : null,
    options.environments.length > 1
      ? {
          key: "ambiente",
          label: "Ambiente",
          value: selected.environment,
          items: options.environments.map((slug) => ({
            value: slug,
            label: environmentLabel(slug),
          })),
        }
      : null,
    options.materials.length > 0
      ? {
          key: "material",
          label: "Material",
          value: selected.material,
          items: options.materials.map((value) => ({ value, label: value })),
        }
      : null,
    options.finishes.length > 0
      ? {
          key: "acabamento",
          label: "Acabamento",
          value: selected.finish,
          items: options.finishes.map((value) => ({ value, label: value })),
        }
      : null,
    options.collections.length > 0
      ? {
          key: "colecao",
          label: "Coleção",
          value: selected.collection,
          items: options.collections.map((value) => ({ value, label: value })),
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    value: string;
    items: Array<{ value: string; label: string }>;
  }>;

  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 border-y border-line py-6 lg:flex-row lg:flex-wrap lg:items-end lg:gap-8">
      {groups.map((group) => (
        <label key={group.key} className="min-w-[10rem] flex-1">
          <span className="eyebrow">{group.label}</span>
          <select
            className="field mt-2 bg-transparent"
            value={group.value}
            onChange={(event) => update(group.key, event.target.value)}
          >
            <option value="">Todos</option>
            {group.items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
