import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "./services/auth.services";
import { AUTH_KEY } from "./utils/constants";

export async function middleware(request: NextRequest) {
  // Allow access to view-shipment page without authentication
  if (request.nextUrl.pathname.startsWith("/view-shipment")) {
    return NextResponse.next();
  }

  try {
    const accessToken = request.cookies.get(AUTH_KEY)?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const user = await currentUser(accessToken);
  } catch {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/view-shipment/:path*"],
};
