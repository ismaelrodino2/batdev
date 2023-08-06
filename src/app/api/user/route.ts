import prisma from "@/utils/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.url ? new URL(req.url) : new URL("");

  const id: string = searchParams.get("userId")!;

  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });
    return new Response(JSON.stringify({ user }));
  } catch (err) {
    return new Response(JSON.stringify({ name: null }));
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        id: body.id,
      },
    });
    return new Response(JSON.stringify({ user }));
  } catch (err) {
    return new Response(JSON.stringify({ user: null }));
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  try {
    const user = await prisma.user.delete({
      where: {
        id: body.data.id,
      },
    });
    return new Response(JSON.stringify({ user: user }));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ user: null }));
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  try {
    const updateData: {
      updatedAt: Date;
      name?: string; // Make sure to include all possible properties you might update
      avatarUrl?: string;
      avatarKey?: string;
    } = {
      updatedAt: new Date(),
    };

    if (body.name) {
      updateData.name = body.name;
    }

    if (body.pic) {
      updateData.avatarUrl = body.pic;
      updateData.avatarKey = body.key;
    }

    let user;
    if (updateData.name || updateData.avatarUrl) {
      user = await prisma.user.update({
        where: {
          id: body.id,
        },
        data: updateData,
      });
    }

    return new Response(JSON.stringify({ user: user }));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ user: null }));
  } finally {
    await prisma.$disconnect();
  }
}
