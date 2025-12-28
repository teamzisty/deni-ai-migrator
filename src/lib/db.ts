import { Pool } from "pg";
import type { LegacyChatSession, LegacyMessage } from "./types";

let masterPool: Pool | null = null;

function getPool(connectionString: string | undefined, label: string) {
  if (!connectionString) {
    throw new Error(`${label} database URL is not configured`);
  }
  return new Pool({ connectionString });
}

export function getMasterPool() {
  if (!masterPool) {
    masterPool = getPool(
      process.env.MASTER_DATABASE_URL ?? process.env.DATABASE_URL,
      "MASTER",
    );
  }
  return masterPool;
}

function toIsoString(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

function normalizeLegacyMessages(value: unknown): LegacyMessage[] {
  if (Array.isArray(value)) {
    return value as LegacyMessage[];
  }
  return [];
}

export async function fetchLegacyChatsByUserId(
  userId: string,
): Promise<LegacyChatSession[]> {
  const pool = getMasterPool();
  const result = await pool.query(
    `SELECT id, title, created_at AS "createdAt", updated_at AS "updatedAt", messages
     FROM chat_sessions
     WHERE user_id = $1
     ORDER BY created_at ASC`,
    [userId],
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    title: row.title ?? "Untitled chat",
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt ?? row.createdAt),
    messages: normalizeLegacyMessages(row.messages),
  }));
}
