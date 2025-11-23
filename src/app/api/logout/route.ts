import { logout } from "@/src/lib/logout";
import { getSession } from "@/src/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await logout();
}
