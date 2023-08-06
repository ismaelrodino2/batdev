import { ClientHome } from "@/components/client-home";
import Posts from "@/components/posts";
import { SideHome } from "@/components/side-home";
import prisma from "@/utils/prisma";
import { Pagination, Stack, Typography } from "@mui/material";

async function getPostsData() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

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
export const revalidate = 60; // revalidate this page every 60 seconds

const Home = async () => {
  const postPromise = getPostsData();
  const categoriesPromise = getCategoriesData();
  const posts = await postPromise;
  const categories = await categoriesPromise;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 ">
        <ClientHome posts={posts} categories={categories} />
      </div>
    </div>
  );
};

export default Home;
