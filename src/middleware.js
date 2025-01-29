import { NextResponse } from "next/server";

export function middleware(request) {
    const currentUser = request.cookies.get("token")?.value;
    const url = request.nextUrl.clone();

    if (currentUser && url.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!currentUser && !url.pathname.startsWith("/login")) {
        url.pathname = "/login";
        url.searchParams.set("next", request.nextUrl.pathname); // Lưu trang đích
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
