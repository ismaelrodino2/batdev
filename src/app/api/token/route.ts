import prisma from "@/utils/prisma";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  const token = headers().get("Authorization");
  try {
    const { payload } = await jwtVerify(
      token!,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!)
    );
    return new Response(JSON.stringify({ decodedToken: payload }));
  } catch (err) {
    return new Response(JSON.stringify({ name: null }));
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { info } = body;
  try {
    const token = await new SignJWT(info)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!));
    return new Response(JSON.stringify({ token }));
  } catch (err) {
    return new Response(JSON.stringify({ token: null }));
  } finally {
    await prisma.$disconnect();
  }
}
