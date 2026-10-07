export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function instagramHref(handle: string): string {
  return `https://www.instagram.com/${handle.replace(/^@/, "")}/`;
}

export function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function formatAddress(parts: {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip?: string;
}): string {
  const line = `${parts.street} — ${parts.neighborhood}, ${parts.city} - ${parts.state}`;
  return parts.zip ? `${line}, ${parts.zip}` : line;
}
