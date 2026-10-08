/** Split Klassic CSV dimension text into labeled topic lines. Do not invent values. */

function expandLabel(label) {
  return label
    .replace(/c\/1\s*/gi, "com 1 ")
    .replace(/c\/\s*/gi, "com ")
    .replace(/\s+/g, " ")
    .trim();
}

function capitalizeLine(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatLine(chunk) {
  const index = chunk.indexOf(":");
  if (index === -1) return capitalizeLine(expandLabel(chunk));
  const label = capitalizeLine(expandLabel(chunk.slice(0, index)));
  const value = chunk.slice(index + 1).trim().replace(/\.$/, "");
  return value ? `${label}: ${value}` : label;
}

function isLabeled(part) {
  const label = part.split(":")[0] ?? "";
  return /[A-Za-zÀ-ú]/.test(label) && part.includes(":");
}

function splitLabeledChunks(clause) {
  const bits = clause.split(/;\s*/).map((bit) => bit.trim()).filter(Boolean);
  const lines = [];
  for (const bit of bits) {
    if (isLabeled(bit) || lines.length === 0) lines.push(bit);
    else lines[lines.length - 1] += `; ${bit}`;
  }
  return lines;
}

export function parseDimensionLines(text) {
  const source = String(text || "").trim();
  if (!source) return [];

  const lxp = source.match(
    /^(\d+(?:,\d+)?)x(\d+(?:,\d+)?)x(\d+(?:,\d+)?)\s*cm\s*\(LxPxA\)\.?$/i,
  );
  if (lxp) {
    return [
      `Largura: ${lxp[1]} cm`,
      `Profundidade: ${lxp[2]} cm`,
      `Altura: ${lxp[3]} cm`,
    ];
  }

  const clauses = source
    .split(/\.\s+/)
    .map((clause) => clause.replace(/\.$/, "").trim())
    .filter(Boolean);

  const lines = clauses.flatMap(splitLabeledChunks).map(formatLine).filter(Boolean);
  return lines.map((line, index, all) => {
    const previous = all[index - 1] ?? "";
    if (/^Aberta:/i.test(line) && /^Profundidade/i.test(previous)) {
      return line.replace(/^Aberta:/i, "Profundidade aberta:");
    }
    if (/^Retrátil aberto:/i.test(line) && /^Profundidade/i.test(previous)) {
      return line.replace(/^Retrátil aberto:/i, "Profundidade aberta:");
    }
    return line;
  });
}
