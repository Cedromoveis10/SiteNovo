import pg from "pg";
import type { QuoteLead } from "@/lib/email";

export async function insertQuoteLead(lead: QuoteLead, source: string) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL missing; quote was emailed but not stored.");
    return;
  }

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query(
      `
      insert into public.quote_leads (
        name, phone, showroom_id, items, message, source
      )
      values ($1, $2, $3, $4, $5, $6)
      `,
      [
        lead.name,
        lead.phone,
        lead.showroomId,
        lead.items,
        lead.message || null,
        source,
      ],
    );
  } finally {
    await client.end();
  }
}
