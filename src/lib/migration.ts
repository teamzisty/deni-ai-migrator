import type { LegacyChatSession } from "./types";

export type ExportPayload = {
  format: "app-message-export";
  version: number;
  exportedAt: string;
  source: { app: string; channel: "master" | "canary" | string };
  chats: LegacyChatSession[];
};

export function buildExportPayload(chats: LegacyChatSession[]): ExportPayload {
  return {
    format: "app-message-export",
    version: 1,
    exportedAt: new Date().toISOString(),
    source: { app: "deni-ai", channel: "master" },
    chats,
  };
}
