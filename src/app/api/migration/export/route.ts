import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchLegacyChatsByUserId } from "@/lib/db";
import { buildExportPayload } from "@/lib/migration";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 },
    );
  }

  const chats = await fetchLegacyChatsByUserId(session.user.id);
  const payload = buildExportPayload(chats);

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="message.json"',
    },
  });
}
