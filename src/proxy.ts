import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./lib/auth/session";

const protectedRoutes = ["/"];
const publicRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path !== path.toLowerCase()) {
    return NextResponse.redirect(
      new URL(path.toLowerCase() + request.nextUrl.search, request.url)
    );
  }
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  // console.log("session", session);

  if (isProtectedRoute && !session?.email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && session?.email) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
