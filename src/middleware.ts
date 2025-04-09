import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request });

    // If the user is not logged in or not an admin, redirect to login
    if (!token || token.role !== "ADMIN") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Specify the paths middleware should match against
export const config = {
  matcher: ["/admin/:path*"],
};
