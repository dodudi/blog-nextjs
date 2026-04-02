import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED_PAGES = ["/write", "/settings"];
const MUTATING_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    if (PROTECTED_PAGES.some((p) => pathname.startsWith(p))) {
        if (!isLoggedIn) {
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    if (pathname.startsWith("/api/") && MUTATING_METHODS.includes(req.method)) {
        if (!isLoggedIn) {
            return NextResponse.json(
                { error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다." } },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/write/:path*",
        "/settings/:path*",
        "/api/posts/:path*",
        "/api/draft/:path*",
        "/api/categories/:path*",
    ],
};
