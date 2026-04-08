import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname === "/docentes") {
    return NextResponse.redirect(new URL("/docentes/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/docentes"],
};
