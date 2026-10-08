import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { parseDimensionLines } from "./parse-klassic-measures.mjs";

const SRC = "/Users/lucasstraub/Downloads/Estofados-2";
const DEST = join(process.cwd(), "public/products");
const JSON_PATH = join(process.cwd(), "src/data/products.json");
const SUPPLIERS_PATH = join(process.cwd(), "scripts/product-suppliers.json");
const PHOTO_RE = /^(Estofado|Poltrona) (.+?)(?: \((\d+)\))?\.png$/i;
const JSON_ONLY = process.argv.includes("--json-only");

function fold(value) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  lines.shift();
  return lines.map((line) => {
    const match = line.match(/^([^;]+);(?:"([^"]*)"|([^;]*));(.*)$/);
    if (!match) throw new Error(`CSV inválido: ${line}`);
    return {
      name: match[1].trim(),
      dimensions: (match[2] ?? match[3] ?? "").trim(),
      mechanism: match[4].trim(),
    };
  });
}

const SQUARE = 1080;
const PHOTO_MARGIN = 0.05;

async function frameSquare(src, dest) {
  const trimmed = await sharp(src)
    .trim({ threshold: 14 })
    .toBuffer({ resolveWithObject: true });
  const inner = Math.round(SQUARE * (1 - PHOTO_MARGIN * 2));
  const scale = Math.min(inner / trimmed.info.width, inner / trimmed.info.height);
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

function description(kind, mechanism) {
  if (kind === "Poltrona") return "Poltrona.";
  if (mechanism.includes("Retrátil") && mechanism.includes("Fixo")) {
    return "Estofado modular, com opções retrátil e fixo.";
  }
  if (mechanism === "Retrátil") return "Estofado modular retrátil.";
  return "Estofado modular fixo.";
}

const groups = new Map();
for (const file of readdirSync(SRC)) {
  if (!file.toLowerCase().endsWith(".png")) continue;
  const match = file.match(PHOTO_RE);
  if (!match) {
    console.warn("arquivo sem padrão reconhecido:", file);
    continue;
  }
  const kind = match[1];
  const rawName = match[2];
  const n = match[3] ? Number(match[3]) : 1;
  const key = fold(rawName);
  if (!groups.has(key)) groups.set(key, { kind, rawName, files: [] });
  groups.get(key).files.push({ n, file });
}

for (const group of groups.values()) {
  group.files.sort((a, b) => a.n - b.n);
}

const rows = parseCsv(readFileSync(join(SRC, "catalogo_produtos.csv"), "utf8"));
const existing = JSON.parse(readFileSync(JSON_PATH, "utf8"));
let previousSuppliers = {};
try {
  previousSuppliers = JSON.parse(readFileSync(SUPPLIERS_PATH, "utf8"));
} catch {
  previousSuppliers = Object.fromEntries(
    existing
      .filter((product) => product.supplier)
      .map((product) => [product.id, product.supplier]),
  );
}
const kept = existing.filter((product) => previousSuppliers[product.id] !== "Klassic");
const klassic = [];
const skipped = [];

for (const row of rows) {
  const group = groups.get(fold(row.name));
  if (!group) {
    skipped.push(row.name);
    continue;
  }

  const slug = slugify(`${group.kind} ${group.rawName}`);
  const name = `${group.kind} ${row.name}`;
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

  klassic.push({
    id: slug,
    name,
    slug,
    category: group.kind === "Poltrona" ? "poltronas" : "estofados",
    subcategory: row.mechanism || undefined,
    environment: ["sala-de-estar"],
    description: description(group.kind, row.mechanism),
    dimensionLines: parseDimensionLines(row.dimensions),
    materials: ["Tecido"],
    featured: false,
    images,
  });
}

const catalog = [...kept, ...klassic];
const suppliers = Object.fromEntries(
  catalog.map((product) => [
    product.id,
    previousSuppliers[product.id] ??
      (klassic.some((item) => item.id === product.id) ? "Klassic" : "Home"),
  ]),
);

writeFileSync(
  JSON_PATH,
  `${JSON.stringify(
    catalog.map(({ supplier, dimensions, width, height, depth, ...product }) => product),
    null,
    2,
  )}\n`,
);
writeFileSync(SUPPLIERS_PATH, `${JSON.stringify(suppliers, null, 2)}\n`);

console.log(`home: ${kept.length}`);
console.log(`klassic com foto: ${klassic.length}`);
console.log(`csv sem foto (fora do site): ${skipped.join(", ") || "nenhum"}`);
console.log(
  "fotos sem csv:",
  [...groups.keys()]
    .filter((key) => !rows.some((row) => fold(row.name) === key))
    .join(", ") || "nenhum",
);
