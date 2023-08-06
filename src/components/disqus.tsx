"use client";
import { DiscussionEmbed } from "disqus-react";

const Disqus = ({
  id,
  allowComments,
}: {
  id: string;
  allowComments: boolean;
}) => {
  if (!allowComments) {
    return null;
  }
  return (
    <div>
      <DiscussionEmbed
        shortname="batdev"
        config={{
          url: process.env.NEXT_PUBLIC_DISQUS + id,
          identifier: id,
        }}
      />
    </div>
  );
};
export default Disqus;
