"use client";
import Image from "next/image";
import { useState } from "react";

export const ImagePlaceholder = ({
  pic,
  alt,
  posts,
}: {
  pic: string;
  alt: string;
  posts: boolean;
}) => {
  const [isLoading, setLoading] = useState(true);
  function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="aspect-w-1 aspect-h-1 w-full h-64 xl:h-96 relative overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
      <Image
        alt=""
        src={pic}
        fill
        className={cn(
          "duration-700 ease-in-out group-hover:opacity-75",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
};
