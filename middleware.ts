import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;
  const isAuth = !!(req as { auth?: { user?: unknown } }).auth?.user;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtected = pathname.startsWith("/fichas");

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/fichas", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
