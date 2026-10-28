import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only check /admin routes
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("optom_admin_auth");
    const isAuthenticated = authCookie?.value === "authenticated_token_true";

    // If user is at /admin/login
    if (pathname === "/admin/login") {
      // If already logged in, redirect to /admin dashboard
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // If accessing any protected admin page without authentication
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
