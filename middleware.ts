// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

export { default } from "next-auth/middleware";
export const config = { matcher: ["/dashboard/:path*"] };


// import { withAuth } from "next-auth/middleware";
// import { NextRequest, NextResponse } from "next/server";

// export default withAuth(
//   function middleware(req: NextRequest) {
//     // return NextResponse
//     return NextResponse.rewrite(new URL("/dashboard", req.url));
//   },
//   {
//     callbacks: {
//       authorized({ token }) {
//         console.log(token)
//         return token?.status === "true";
//       },
//     },
//   }
// );

// export const config = { matcher: ["/", "/dashboard"] };