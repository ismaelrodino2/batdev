import { AlertColor } from "@mui/material";
import { getCookie } from "cookies-next";
import { supabase } from "./supabase";
import { Category, Post, User } from "./types";
import axios from "axios";

export async function createPost(
  description: string,
  togglechecked: boolean,
  postPicture: File,
  title: string,
  categories: Array<Category>,
  user: User | undefined
) {
  try {
    let url;
    let key;
    const file = postPicture;
    const fileExt = file?.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const res = await supabase.storage.from("posts").upload(filePath, file);
    if (res.error) {
      console.log(res.error);
      return;
    }

    key = res.data?.path;
    url = supabase.storage.from("posts").getPublicUrl(res?.data?.path);

    const userCookie = user;

    const data = {
      id: userCookie?.id,
      user: userCookie?.name,
      authorId: userCookie?.id,
      title,
      content: description,
      postPic: url ? url?.data.publicUrl : null,
      postPicKey: key ? key : null,
      allowComments: togglechecked,
      categories,
    };
    try {
      const res = axios.post("/api/post/", { data });
      return await res;
    } catch (err) {
      console.log(err);
      return null;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function editPost(id: string, content: string) {
  try {
    await axios.put("/api/post/", { id, content });
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function deletePost(post: Post) {
  const data = { id: post.id };
  try {
    let image;
    if (typeof post.postPicKey === "string") {
      // Delete the image from Supabase storage by providing an array of keys
      image = await supabase.storage.from("posts").remove([post.postPicKey]);
    }

    // Delete the post from your API
    const response = await axios.delete("api/post", { data });

    if (response.status === 200) {
      console.log("Post deleted successfully!");
      return response.data; // Assuming your API returns the deleted post data
    } else {
      console.error("Error deleting post:", response.statusText);
      return null;
    }
  } catch (err) {
    console.error("Error deleting post:", err);
    return null;
  }
}

export const SuccessBar = (
  setMessage: (message: string) => void,
  setSeverity: (severity: AlertColor | undefined) => void,
  message: string,
  setOpen: (value: boolean) => void
) => {
  setMessage(message);
  setOpen(true);
  setSeverity("success");
};

export const ErrorBar = (
  setMessage: (message: string) => void,
  setSeverity: (severity: AlertColor | undefined) => void,
  message: string,
  setOpen: (value: boolean) => void
) => {
  setMessage(message);
  setSeverity("error");
  setOpen(true);
};

export const Cookies = async () => {
  const cookie = getCookie("supabase-auth", {}); // => 'value'
  if (typeof cookie == "string" && cookie) {
    const cookies: any = await axios.get("/api/token", {
      headers: {
        Authorization: JSON.parse(cookie).token,
      },
    });
    return cookies?.data?.decodedToken;
  } else {
    return null;
  }
};

// linksData
export const linksNotAuth = [
  { name: "Home", link: "/" },
  { name: "About me", link: "aboutme" },
];

export const linksAuth = [
  { name: "Home", link: "/" },
  { name: "Write", link: "/newpost" },
  { name: "My posts", link: "/myposts" },
  { name: "Profile", link: "/profile" },
  { name: "About me", link: "/aboutme" },
];
