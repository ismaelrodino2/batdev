import prisma from "@/utils/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const post = await prisma.post.create({
      data: {
        authorId: body.data.authorId,
        title: body.data.title,
        content: body.data.content,
        postPic: body.data.postPic,
        postPicKey: body.data.postPicKey,
        allowComments: false,
        categories: {
          create: body.data.categories.map((category: any) => ({
            category: {
              connect: {
                id: category.id,
              },
            },
          })),
        },
      },
    });

    return new Response(JSON.stringify({ post }));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ post: null }));
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  try {
    const post = await prisma.post.delete({
      where: {
        id: body.id,
      },
    });
    return new Response(JSON.stringify({ post: post }));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ post: null }));
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  try {
    const post = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        content: body.content,
      },
    });
    return new Response(JSON.stringify({ post: post }));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ post: null }));
  } finally {
    await prisma.$disconnect();
  }
}
