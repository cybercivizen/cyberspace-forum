import { logout } from "@/src/lib/auth/logout";
import { getSession } from "@/src/lib/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await logout();
}
