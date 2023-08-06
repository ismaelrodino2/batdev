"use client";

import { FormEvent, useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/contexts/AuthContext";
import { HiOutlineRefresh } from "react-icons/hi";

const Signin = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const email = e.currentTarget.username.value;
    const password = e.currentTarget.password.value;

    try {
      // Perform your login logic here

      // Call the login function from the context
      await login(email, password);
    } catch (error) {
      // Handle login error
      console.log(error);
    } finally {
      setLoading(false);
    }
    // if (
    //   username === process.env.USERNAME &&
    //   password === process.env.PASSWORD
    // ) {
    //   setCookie("Auth", { authenticated: true }, { maxAge: 60 * 6 * 24 });

    //   router.push("/");
    //   //add cookie
    // } else {
    //   throw new Error("wrong fields");
    // }
  };

  return (
    <div className="flex px-4 flex-col justify-center items-center min-h-[calc(100vh-112px)]">
      <form
        onSubmit={handleSubmit}
        className="
      border p-6 rounded-lg bg-neutral shadow-lg
      "
      >
        <input
          type="text"
          className="border border-accent bg-ice bg-neutral text-primary rounded p-2 mb-2 w-full"
          name="username"
          placeholder="Username"
        />
        <input
          className="border border-accent bg-neutral bg-ice text-primary rounded p-2 mb-2 w-full"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button
          type="submit"
          disabled={loading ? true : false}
          className={`rounded p-2 w-full flex items-center justify-center text-white ${
            loading
              ? "bg-accent cursor-not-allowed"
              : "bg-secondary cursor-pointer"
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <HiOutlineRefresh className="animate-spin mr-2" /> Sign In
            </span>
          ) : (
            <span> Sign In</span>
          )}
        </button>
      </form>
      <p className="text-black900 font-bold mt-4">
        Don&apos;t have an account yet?{" "}
        <Link className="text-secondary" href="/signup">
          Sign Up
        </Link>
      </p>
    </div>
  );
};
export default Signin;
