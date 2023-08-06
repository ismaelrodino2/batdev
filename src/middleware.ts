import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const supabaseCookie = request.cookies.get("supabase-auth");
  let token;
  let user;
  if (supabaseCookie) {
    token = JSON.parse(supabaseCookie?.value!)?.token;
    user = await jwtVerify(
      token!,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!),
    );
  }

  if (!user?.payload) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/newpost", "/myposts", "/profile"],
};
