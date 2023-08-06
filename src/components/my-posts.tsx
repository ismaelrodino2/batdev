"use client";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import { Button, Box } from "@mui/material";
import { Categories, Post, Posts } from "@/utils/types";
import { deletePost, editPost } from "@/utils/helpers";
import Tiptap from "./editor";
import { HiOutlineRefresh } from "react-icons/hi";

interface MyPostsProps {
  posts: Posts;
  categories: Categories;
}

export const MyPosts: React.FC<MyPostsProps> = ({ posts, categories }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [description, setDescription] = useState<string>("");
  const [clearEditor, setClearEditor] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  // Function to delete a post
  const handleDeletePost = async (post: Post) => {
    setIsLoadingDelete(true)
    try {
      await deletePost(post);

      setShowDeleteModal(false);
    } catch (err) {
      console.log(err);
    }finally{
      setIsLoadingDelete(false)
    }
  };

  // Function to edit a post
  const handleEditPost = async (post: Post | null) => {

    if (post?.id) {
      try {
        setIsLoadingEdit(true);
        await editPost(post?.id, description);

        setShowEditModal(false);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoadingEdit(false);
      }
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          className="p-4 border border-gray-200 rounded-lg shadow-md mb-4"
        >
          <h2 className="text-xl font-semibold mb-2">
            {/* Limit title to 40 characters */}
            {post.title.length > 40
              ? post.title.substring(0, 40) + "..."
              : post.title}
          </h2>
          <p className="text-gray-600 mb-4 flex">
            {/* Show only the first 50 characters of the content */}
            {
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content.substring(0, 50),
                }}
              ></div>
            }
            {post.content.length > 50 ? "..." : ""}
          </p>
          <div className="flex items-center justify-end space-x-4">
            <button
              className="text-red-600 hover:text-red-800"
              onClick={() => {
                setPostToDelete(post);
                setShowDeleteModal(true);
              }}
            >
              Delete
            </button>
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {
                setPostToEdit(post);
                setShowEditModal(true);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      {/* Modal for delete confirmation */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="flex items-center justify-center"
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: "4px",
            maxWidth: "70%",
            maxHeight: "70%",
            overflow: "auto",
          }}
        >
          <h3 className="text-lg font-semibold mb-2">Confirm Deletion?</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this post?
          </p>
          <div className="flex justify-between space-x-4">
            <button
              className="uppercase bg-[#74C2BD] p-2 rounded-md"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                handleDeletePost(postToDelete!);
              }}
              disabled={isLoadingDelete ? true : false}
              className={`uppercase bg-[#ff00008f] rounded-md  p-2  flex items-center justify-center text-white ${
                isLoadingDelete
                  ? "bg-accent cursor-not-allowed"
                  : "bg-secondary cursor-pointer"
              }`}
            >
              {isLoadingDelete ? (
                <span className="flex items-center">
                  <HiOutlineRefresh className="animate-spin mr-2" /> Delete
                </span>
              ) : (
                <span> Delete</span>
              )}
            </button>
          </div>
        </Box>
      </Modal>

      {/* Modal for editing */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="flex items-center justify-center"
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: "4px",
            maxWidth: "70%",
            maxHeight: "70%",
            overflow: "auto",
          }}
        >
          <h3 className="text-lg font-semibold mb-2">Edit Post</h3>

          <Tiptap
            setDescription={setDescription}
            description={
              postToEdit
                ? posts.find((post) => post.id === postToEdit.id)?.content ?? ""
                : ""
            }
            clearEditor={clearEditor}
            setClearEditor={setClearEditor}
          />

          <div className="flex pt-8 justify-between space-x-4">
            <button
              className="uppercase bg-[#ff00008f] p-2 rounded-md"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>

            <button
              onClick={() => handleEditPost(postToEdit)}
              disabled={isLoadingEdit ? true : false}
              className={`uppercase bg-[#74C2BD] rounded-md  p-2  flex items-center justify-center text-white ${
                isLoadingEdit
                  ? "bg-accent cursor-not-allowed"
                  : "bg-secondary cursor-pointer"
              }`}
            >
              {isLoadingEdit ? (
                <span className="flex items-center">
                  <HiOutlineRefresh className="animate-spin mr-2" /> Save
                </span>
              ) : (
                <span> Save</span>
              )}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
