import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Pass through API routes and static assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Admin routes authentication
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("optom_admin_auth");
    const isAuthenticated = authCookie?.value === "authenticated_token_true";

    if (pathname === "/admin/login") {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. User Authentication for Customer storefront (Strict Registration Requirement)
  const userCookie = request.cookies.get("optom_user");
  const isUserAuthenticated = Boolean(userCookie?.value);

  // If already registered/logged in and visits /auth, send to main page (/)
  if (pathname === "/auth") {
    if (isUserAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Strictly require registration: if not registered/logged in, redirect to /auth
  if (!isUserAuthenticated) {
    const authUrl = new URL("/auth", request.url);
    if (pathname !== "/") {
      authUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
