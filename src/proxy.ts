import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Check if user is online; this is just a placeholder condition
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: "/",
};
