"use client";
import { useState } from "react";
import { FormEvent } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import axios from "axios";
import { HiOutlineRefresh } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const { email, username, password } = formData;

    try {
      const { data } = await supabase.auth.signUp({ email, password });

      const id = data.user?.id;
      await axios.post("/api/user", {
        email,
        name: username,
        id,
      });
      toast.success("Done! Check your email.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Reset the form fields
      setFormData({ username: "", email: "", password: "" });
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
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="flex px-4 flex-col justify-center items-center h-[calc(100vh-112px)]">
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
      <form
        onSubmit={handleSubmit}
        className="border p-6 rounded-lg bg-neutral shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <input
          type="text"
          className="border border-accent bg-ice text-primary rounded p-2 mb-2 w-full bg-neutral"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="text"
          className="border border-accent bg-ice text-primary rounded p-2 mb-2 w-full bg-neutral"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <div className="py-2">
          <input
            className="border bg-neutral border-accent bg-ice text-primary rounded p-2 mb-2 w-full"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <label htmlFor="showPassword" className="flex py-2">
            <input
              className="mr-2 w-6 h-6"
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={toggleShowPassword}
            />
            <span>Show Password</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={` bg-secondary py-2  rounded  w-full  p-2  flex items-center justify-center text-white ${
            isLoading
              ? "bg-accent cursor-not-allowed"
              : "bg-secondary cursor-pointer"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <HiOutlineRefresh className="animate-spin mr-2" /> Submit
            </span>
          ) : (
            <span> Submit</span>
          )}
        </button>
      </form>
      <p className="text-primary font-bold mt-4">
        You already have an account?{" "}
        <Link href="/signin" className="text-secondary">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Signup;
