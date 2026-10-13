import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SRC = "/Users/lucasstraub/Downloads/Salva";
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

/** Measures transcribed from Catálogo Salva Completo. Do not invent values. */
const CATALOG = {
  croa: {
    name: "Croá",
    subcategory: "Reclinável",
    dimensionLines: [
      "Módulo com 1 braço: 1,15m; 1,00m; 1,30m",
      "Módulo sem braço: 90cm; 75cm; 1,05m",
      "Canto: 1,28m",
      "Console reto: 32cm",
      "Console ângulo: 42cm",
      "Profundidade fechada: 1,07m",
      "Profundidade aberta: 1,62m",
      "Altura: 90cm",
    ],
  },
  duna: {
    name: "Duna",
    subcategory: "Reclinável",
    dimensionLines: [
      "Módulo com 1 braço: 1,20m",
      "Módulo sem braço: 85cm",
      "Sofá 3 lugares: 3,25m",
      "Profundidade fechada: 1,20m",
      "Profundidade aberta: 1,72m",
      "Altura: 88cm",
    ],
  },
  pier: {
    name: "Pier",
    subcategory: "Fixo",
    dimensionLines: [
      "Sofá: 2,14m",
      "Módulo: 91cm",
      "Módulo com mesa: 1,23m; 1,27m",
      "Profundidade: 91cm; 95cm",
      "Altura: 78cm",
    ],
  },
  poente: {
    name: "Poente",
    subcategory: "Fixo",
    dimensionLines: [
      "Sofá: 3,00m",
      "Profundidade: 94cm",
      "Altura: 85cm",
    ],
  },
  romeu: {
    name: "Romeu",
    subcategory: "Fixo",
    dimensionLines: [
      "Módulo: 83cm; 92cm; 94cm; 1,04m; 1,05m; 1,15m",
      "Sofá: 2,10m; 2,19m; 2,30m; 2,60m; 2,71m",
      "Chaise: 1,15x1,66m",
      "Profundidade: 92cm",
      "Altura: 79cm",
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
  (product) => previousSuppliers[product.id] !== "Salva",
);

const salva = [];
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

  salva.push({
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

const catalog = [...kept, ...salva];
const suppliers = Object.fromEntries(
  catalog.map((product) => [
    product.id,
    previousSuppliers[product.id] ??
      (salva.some((item) => item.id === product.id) ? "Salva" : "Home"),
  ]),
);

writeFileSync(JSON_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
writeFileSync(SUPPLIERS_PATH, `${JSON.stringify(suppliers, null, 2)}\n`);

console.log(`kept: ${kept.length}`);
console.log(`salva: ${salva.map((item) => item.id).join(", ")}`);
console.log(`catálogo sem foto: ${missingPhotos.join(", ") || "nenhum"}`);
console.log(
  "fotos sem ficha:",
  [...groups.keys()]
    .filter((key) => !CATALOG[key])
    .join(", ") || "nenhum",
);
