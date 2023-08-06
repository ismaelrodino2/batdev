"use client";
import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import axios from "axios";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker overlay background color
    },
    content: {
      top: "50%",
      width: "40%",
      height: "45%",
      padding: 0,
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const { user } = useContext(AuthContext);

  const id: string = user?.id || "";

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userPicture, setUserPicture] = useState<File | string | undefined>();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setUserPicture(
        user?.avatarUrl || process.env.NEXT_PUBLIC_GENERIC_AVATAR || ""
      );
    }
  }, [user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleDelete = async () => {
    try {
      await supabase.from("users").delete().eq("id", id);
      await axios.delete("/api/user", {
        data: { id },
      });
      setIsModalOpen(false);
      toast.success("Done!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      logout();
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Error!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleImageUpdate = (newImageUrl: string) => {
    setUserPicture(newImageUrl);
  };

  const handleUpdate = async () => {
    setLoading(true);
    let pic;
    let key;

    if (typeof userPicture !== "string") {
      //UPDATE PICTURE
      const file = userPicture;
      const fileExt = file?.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const res = await supabase.storage
        .from("avatars")
        .upload(filePath, file!);
      key = res?.data?.path;

      const publicUrl = await supabase.storage
        .from("avatars")
        .getPublicUrl(res?.data?.path!);
      pic = publicUrl.data.publicUrl;
    }
    try {
      await axios.put("/api/user", {
        name: name !== user?.name ? name : null,
        id,
        pic,
        key,
      });
      toast.success("Done!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      console.log(err);
      toast.error("Error!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-6 flex flex-col gap-4 px-4">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Modal
        ariaHideApp={false}
        isOpen={isModalOpen}
        style={customStyles}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Example Modal"
      >
        <div className="flex items-center h-full justify-center">
          <div className="flex items-center flex-col justify-center">
            <h2 className="text-xl font-bold mb-4">Delete User Confirmation</h2>
            <p className="mb-4 text-lg">
              Are you sure you want to delete the user?
            </p>
            <div className="flex gap-4 w-full justify-center md:flex-row flex-col">
              <button
                onClick={handleDelete}
                className="bg-red-600 bg-[#a72c2c] py-2 px-4 rounded-md "
              >
                Delete
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <input
        type="text"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
        className="max-w-[100px] p-1 border border-black700 md:max-w-fit text-primary bg-neutral"
      />

      <input
        type="text"
        value={email}
        disabled
        onChange={(e) => setEmail(e.target.value)}
        className="max-w-[100px] md:max-w-fit"
      />

      <div>
        <h2>User picture</h2>
        <div className="flex">
          <div className="bg-gradient-to-b from-blue850 to-cream800 rounded-full cursor-pointer  p-[3px] ">
            <div className="rounded-full cursor-pointer overflow-hidden w-[80px] h-[80px] relative">
              <input
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUserPicture(file);
                  }
                }}
                className="absolute top-0 left-0 w-full h-full opacity-0 z-20 cursor-pointer"
              />
              <Image
                src={
                  typeof userPicture === "string" || !userPicture
                    ? userPicture ||
                      process.env.NEXT_PUBLIC_GENERIC_AVATAR ||
                      ""
                    : URL.createObjectURL(userPicture)
                }
                alt="User picture"
                fill={true}
              />{" "}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={loading ? true : false}
          onClick={handleUpdate}
          className={`rounded w-auto py-2 px-4 flex items-center justify-center text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-secondary cursor-pointer"
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <HiOutlineRefresh className="animate-spin mr-2" /> Save
            </span>
          ) : (
            <span> Save</span>
          )}
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ff0000c7] text-white py-2 px-11 rounded-md shadow-md"
        >
          Delete user
        </button>
      </div>
    </div>
  );
};

export default Settings;
