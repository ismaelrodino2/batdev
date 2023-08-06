import { cookies as nextcookies } from "next/headers";
import prisma from "@/utils/prisma";
import { Categories, Posts } from "@/utils/types";
import { MyPosts } from "@/components/my-posts";

async function getCategoriesData() {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

async function getPosts() {
  const nextCookies = nextcookies();
  const cookies = nextCookies.get("supabase-auth")?.value;
  
  try {
    if (!cookies) return null;

    const posts = await prisma.post.findMany({
      where: {
        authorId: JSON.parse(cookies || "")?.info?.user.data.user.id,
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return posts;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export default async function UpdatePost() {
  const posts: Posts = await getPosts() ?? [];
  const categories: Categories = await getCategoriesData();

  return (
    <div>
      <MyPosts posts={posts} categories={categories} /> 
    </div>
  );
}

