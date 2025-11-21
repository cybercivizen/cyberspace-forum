import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./lib/auth";

export function proxy(request: NextRequest) {
  // Check if user is online; this is just a placeholder condition
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/",
};
