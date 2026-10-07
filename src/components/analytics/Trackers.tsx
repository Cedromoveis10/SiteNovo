"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ProductViewTracker({
  id,
  name,
  category,
}: {
  id: string;
  name: string;
  category: string;
}) {
  useEffect(() => {
    track("view_product", { item_id: id, item_name: name, item_category: category });
  }, [id, name, category]);

  return null;
}

export function CategoryViewTracker({
  category,
}: {
  category: string;
}) {
  useEffect(() => {
    track("view_category", { item_category: category });
  }, [category]);

  return null;
}
