import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SRC = "/Users/lucasstraub/Downloads/Minuano";
const DEST = join(process.cwd(), "public/products");
const JSON_PATH = join(process.cwd(), "src/data/products.json");
const SUPPLIERS_PATH = join(process.cwd(), "scripts/product-suppliers.json");
const PHOTO_RE = /^Estofado (.+?)(?: \((\d+)\))?\.png$/i;
const JSON_ONLY = process.argv.includes("--json-only");

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function fold(value) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

const SQUARE = 1080;
const PHOTO_MARGIN = 0.05;

async function frameSquare(src, dest) {
  const trimmed = await sharp(src)
    .trim({ threshold: 14 })
    .toBuffer({ resolveWithObject: true });
  const inner = Math.round(SQUARE * (1 - PHOTO_MARGIN * 2));
  const scale = Math.min(
    inner / trimmed.info.width,
    inner / trimmed.info.height,
  );
  const width = Math.max(1, Math.round(trimmed.info.width * scale));
  const height = Math.max(1, Math.round(trimmed.info.height * scale));
  const resized = await sharp(trimmed.data).resize(width, height).png().toBuffer();
  await sharp({
    create: {
      width: SQUARE,
      height: SQUARE,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      {
        input: resized,
        left: Math.round((SQUARE - width) / 2),
        top: Math.round((SQUARE - height) / 2),
      },
    ])
    .png()
    .toFile(dest);
}

function description(mechanism) {
  if (mechanism === "Retrátil") return "Estofado em couro, com assento retrátil.";
  if (mechanism === "Reclinável") {
    return "Estofado em couro, com assento reclinável.";
  }
  return "Estofado em couro.";
}

/** Measures transcribed from Catálogo Completo Minuano 2026-1. Do not invent values. */
const CATALOG = {
  collet: {
    name: "Collet",
    subcategory: "Reclinável",
    dimensionLines: [
      "Módulo com 1 braço: 1,20m; 1,10m; 95cm",
      "Módulo sem braço: 86cm; 71cm",
      "Sofá 2 lugares: 2,40m",
      "Sofá 3 lugares: 3,06m; 2,61m",
      "Console: 30cm",
      "Profundidade fechada: 1,00m; 85cm; 70cm",
      "Profundidade aberta: 1,61m",
      "Altura: 95cm",
    ],
  },
  connor: {
    name: "Connor",
    subcategory: "Retrátil",
    dimensionLines: [
      "Módulo com 1 braço: 1,22m; 1,42m",
      "Módulo canto: 2,17m",
      "Sofá 2 braços: 2,44m; 2,14m",
      "Sofá 2 módulos: 2,44m; 2,84m",
      "Canto: 3,39m",
      "Profundidade fechada: 1,15m; 95cm; 80cm",
      "Profundidade aberta: 1,62m",
      "Altura: 92cm",
    ],
  },
  oslo: {
    name: "Oslo",
    subcategory: "Reclinável",
    dimensionLines: [
      "Módulo com 1 braço: 1,05m; 90cm; 1,25m",
      "Módulo sem braço: 85cm; 70cm",
      "Sofá 3 lugares: 2,95m",
      "Console: 30cm",
      "Profundidade fechada: 96cm",
      "Profundidade aberta: 1,61m",
      "Altura: 97cm",
    ],
  },
  puertofixo: {
    name: "Puerto Fixo",
    subcategory: "Fixo",
    dimensionLines: [
      "Sofá 2 lugares: 2,10m",
      "Sofá 3 lugares: 2,40m",
      "Módulo com 1 braço: 1,35m",
      "Sofá 2 módulos: 2,70m",
      "Poltrona: 1,12m",
      "Profundidade: 98cm",
      "Altura: 89cm",
    ],
  },
  puertopower: {
    name: "Puerto Power",
    subcategory: "Reclinável",
    dimensionLines: [
      "Módulo com 1 braço: 1,06m; 91cm",
      "Módulo sem braço: 90cm; 75cm",
      "Sofá 3 lugares: 3,02m; 2,57m",
      "Poltrona: 1,24m",
      "Console: 30cm",
      "Profundidade fechada: 98cm",
      "Profundidade aberta: 1,51m",
      "Altura: 89cm",
    ],
  },
  santiago: {
    name: "Santiago",
    subcategory: "Fixo",
    dimensionLines: [
      "Sofá: 2,36m; 2,13m; 1,90m; 1,47m",
      "Módulo com 1 braço: 1,27m; 1,84m",
      "Sofá 2 módulos: 2,54m",
      "Chaise: 95cm; composição 2,79m",
      "Módulo: 80x68cm",
      "Profundidade: 90cm; chaise 1,42m",
      "Altura: 90cm",
    ],
  },
  santorini: {
    name: "Santorini",
    subcategory: "Fixo",
    dimensionLines: [
      "Módulo com 1 braço: 1,35m; 2,14m",
      "Sofá 2 braços: 2,44m; 2,10m",
      "Sofá 2 módulos: 2,70m",
      "Chaise: 1,22m; composição 3,36m",
      "Poltrona: 1,11m",
      "Profundidade: 95cm; chaise 1,47m",
      "Altura: 80cm",
    ],
  },
  sebastian: {
    name: "Sebastian",
    subcategory: "Retrátil",
    dimensionLines: [
      "Módulo com 1 braço: 1,22m; 1,40m; 1,05m",
      "Módulo canto: 2,34m",
      "Sofá: 2,44m; 2,10m; 1,90m",
      "Profundidade fechada: 1,12m; 95cm; 85cm",
      "Profundidade aberta: 1,49m; 1,30m; 1,08m",
      "Altura: 89cm",
    ],
  },
  teruel: {
    name: "Teruel",
    subcategory: "Fixo",
    dimensionLines: [
      "Sofá: 2,30m; 2,06m; 1,50m",
      "Módulo com 1 braço: 1,35m; 1,05m",
      "Sofá 2 módulos: 2,70m",
      "Profundidade: 91cm",
      "Altura: 81cm",
    ],
  },
};

const groups = new Map();
for (const file of readdirSync(SRC)) {
  if (!file.toLowerCase().endsWith(".png")) continue;
  const match = file.match(PHOTO_RE);
  if (!match) {
    console.warn("arquivo sem padrão reconhecido:", file);
    continue;
  }
  const rawName = match[1];
  const n = match[2] ? Number(match[2]) : 1;
  const key = fold(rawName);
  if (!groups.has(key)) groups.set(key, { rawName, files: [] });
  groups.get(key).files.push({ n, file });
}

for (const group of groups.values()) {
  group.files.sort((a, b) => a.n - b.n);
}

const existing = JSON.parse(readFileSync(JSON_PATH, "utf8"));
const previousSuppliers = JSON.parse(readFileSync(SUPPLIERS_PATH, "utf8"));
const kept = existing.filter(
  (product) => previousSuppliers[product.id] !== "Minuano",
);

const minuano = [];
const missingPhotos = [];

for (const [key, spec] of Object.entries(CATALOG)) {
  const group = groups.get(key);
  if (!group) {
    missingPhotos.push(spec.name);
    continue;
  }

  const slug = slugify(`Estofado ${spec.name}`);
  const name = `Estofado ${spec.name}`;
  const previous = existing.find((product) => product.id === slug);
  const images = [];
  for (const [index, item] of group.files.entries()) {
    const destName = index === 0 ? `${slug}.png` : `${slug}-${item.n}.png`;
    if (!JSON_ONLY) {
      await frameSquare(join(SRC, item.file), join(DEST, destName));
    }
    images.push(
      previous?.images?.[index] ?? {
        src: `/products/${destName}`,
        alt: index === 0 ? name : `${name}, vista ${item.n}`,
      },
    );
  }

  minuano.push({
    id: slug,
    name,
    slug,
    category: "estofados",
    subcategory: spec.subcategory,
    environment: ["sala-de-estar"],
    description: description(spec.subcategory),
    dimensionLines: spec.dimensionLines,
    materials: ["Couro"],
    featured: false,
    images,
  });
}

const catalog = [...kept, ...minuano];
const suppliers = Object.fromEntries(
  catalog.map((product) => [
    product.id,
    previousSuppliers[product.id] ??
      (minuano.some((item) => item.id === product.id) ? "Minuano" : "Home"),
  ]),
);

writeFileSync(JSON_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
writeFileSync(SUPPLIERS_PATH, `${JSON.stringify(suppliers, null, 2)}\n`);

console.log(`kept: ${kept.length}`);
console.log(`minuano: ${minuano.map((item) => item.id).join(", ")}`);
console.log(`catálogo sem foto: ${missingPhotos.join(", ") || "nenhum"}`);
console.log(
  "fotos sem ficha:",
  [...groups.keys()]
    .filter((key) => !CATALOG[key])
    .join(", ") || "nenhum",
);
