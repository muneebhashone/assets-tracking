import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { AUTH_KEY } from "./utils/constants";
import { currentUser } from "./services/auth.services";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
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
  matcher: ["/dashboard/:path*"],
};
