import { copyFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SRC = "/Users/lucasstraub/Downloads/Estofados-2";
const DEST = join(process.cwd(), "public/products");
const JSON_PATH = join(process.cwd(), "src/data/products.json");
const SUPPLIERS_PATH = join(process.cwd(), "scripts/product-suppliers.json");
const PHOTO_RE = /^(Estofado|Poltrona) (.+?)(?: \((\d+)\))?\.png$/i;

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
  const images = group.files.map((item, index) => {
    const destName = index === 0 ? `${slug}.png` : `${slug}-${item.n}.png`;
    const destPath = join(DEST, destName);
    copyFileSync(join(SRC, item.file), destPath);
    return { destPath, destName, n: item.n, index };
  });

  klassic.push({
    id: slug,
    name,
    slug,
    category: group.kind === "Poltrona" ? "poltronas" : "estofados",
    subcategory: row.mechanism || undefined,
    environment: ["sala-de-estar"],
    description: description(group.kind, row.mechanism),
    dimensions: row.dimensions || undefined,
    featured: false,
    images: await Promise.all(
      images.map(async (item) => {
        const buffer = await sharp(item.destPath)
          .trim({ threshold: 12 })
          .png()
          .toBuffer();
        await sharp(buffer).toFile(item.destPath);
        return {
          src: `/products/${item.destName}`,
          alt:
            item.index === 0 ? name : `${name}, vista ${item.n}`,
        };
      }),
    ),
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
    catalog.map(({ supplier, ...product }) => product),
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
