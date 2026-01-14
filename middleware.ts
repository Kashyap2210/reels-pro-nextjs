import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        // console.log("pathname", pathname);

        // allow auth related routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }
        if (pathname === "/" || pathname.startsWith("/api/videos")) {
          return true;
        }

        return !!token;
      },
    },
  }
);
 
// here we declare where we want middleware to run
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
