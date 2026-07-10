import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/rivfox-admin")) {
    const isAdmin = request.cookies.get("rivfox-admin")?.value === "a2zFc9YTHpgiOxRH4"

    if (!isAdmin) {
      return NextResponse.rewrite(new URL("/404", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/rivfox-admin/:path*",
}