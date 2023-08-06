"use client";
import { useState, useEffect, useContext } from "react";
import { Pagination, Stack, Typography } from "@mui/material";
import { SideHome } from "./side-home";
import Posts from "./posts";
import { Categories, Posts as PostsType, Post, Category } from "@/utils/types";
import { SearchContext } from "@/contexts/SearchContext";
import Header from "./header";

export const ClientHome = ({
  posts,
  categories,
}: {
  posts: PostsType;
  categories: Categories;
}) => {
  const { searchValue } = useContext(SearchContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<Category["name"]>("");
  const [filteredPosts, setFilteredPosts] = useState<PostsType>([]);

  useEffect(() => {
    // Filter the posts whenever there is a change in the filters
    const filtered = posts.filter((post) => {
      const titleMatch = post.title
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const categoryMatch =
        categoryFilter === "" ||
        post.categories.some((category) =>
          category.category.name
            .toLowerCase()
            .includes(categoryFilter.toLowerCase())
        );

      return titleMatch && categoryMatch;
    });

    setFilteredPosts(filtered);
  }, [searchValue, categoryFilter, posts]);

  const postsPerPage = 5;
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-4">
      <div className="bg-neutral pt-4 pl-4">
        <Stack spacing={2}>
          <Typography>Page: {currentPage}</Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </div>
      <Header
        firstTxt="A place for your Development stories"
        title="BLOG OF ISMAEL RODINO"
      />

      <div className="bg-neutral px-4 md:px-0">
        <div className=" mx-auto  flex max-w-7xl  flex-col md:flex-row">
          <div className="order-2 w-full md:order-1 md:w-[80%]">
            {filteredPosts
              .slice(
                (currentPage - 1) * postsPerPage,
                currentPage * postsPerPage
              )
              .map((el: Post) => {
                return (
                  <div key={el.id} className="">
                    <Posts post={el} />
                  </div>
                );
              })}
          </div>
          <div className="order-1 flex w-full flex-col items-center justify-end self-start bg-neutral md:order-2 md:ml-[80px] md:mr-[40px] md:w-[20%]">
            <SideHome
              categoryName={categoryFilter}
              categories={categories}
              setCategoryName={setCategoryFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
