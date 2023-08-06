"use client";

import Link from "next/link";
import HTMLEllipsis from "react-lines-ellipsis/lib/html";
import dateFormat from "dateformat";
import sanitizeHtml from "sanitize-html";
import DateCircle from "./data-circle";
import { ImagePlaceholder } from "./image-placeholder";
import { Post } from "@/utils/types";

const cleanTitle = (desc: string) => {
  const maxLength = 40;
  const sanitizedDesc = sanitizeHtml(desc);

  if (sanitizedDesc.length <= maxLength) {
    return sanitizedDesc;
  } else {
    return sanitizedDesc.substring(0, maxLength) + "...";
  }
};

type PropTypes = {
  post: Post;
};

export default function Posts({ post }: PropTypes) {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center">
        <div className="hidden lg:block ml-[40px] self-start">
          <DateCircle>
            {dateFormat(new Date(post.createdAt), "paddedShortDate")}
            {/* m/d/a */}
          </DateCircle>
        </div>
        <div className="flex flex-col w-full md:ml-[40px]">
          <Link href={`/post/${post.id}`}>
            {post.postPic ? (
              <div className="relative">
                <ImagePlaceholder
                  alt="Post picture"
                  pic={post?.postPic}
                  posts
                />
              </div>
            ) : (
              ""
            )}
          </Link>

          <div className="flex ">
            <div className="flex flex-col">
              <div className="flex  text-center pt-8 pb-4 gap-5 flex-wrap  items-center">
                <p className="text-secondary text-[14px] md:hidden">
                  {dateFormat(new Date(post.createdAt), "paddedShortDate")}
                </p>
                <p className="text-[14px] text-accent">
                  By
                  <span className="text-secondary pl-1">
                    {post.author.name}
                  </span>
                </p>
                <p className="text-[14px] text-accent">
                  Tags:
                  <span className="text-secondary pl-1">
                    {post.categories.map((cat: any, index: number) => {
                      return (
                        <span key={cat.categoryId}>
                          {(index ? ", " : "") + cat.category.name}
                        </span>
                      );
                    })}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Link href={`/post/${post.id}`}>
                  <h2
                    data-testid="posts"
                    className="hover:text-secondary transition-all ease-in-out duration-300"
                  >
                    {cleanTitle(post.title)}
                  </h2>
                </Link>
                <div className=" flex flex-wrap pb-24">
                  <HTMLEllipsis
                    unsafeHTML={post.content.replace(/<img .*?>/g, "")}
                    maxLine="2"
                    ellipsis="..."
                    ellipsisHTML="<i style='color:#74C2BD'> [...] </i>"
                    basedOn="letters"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
