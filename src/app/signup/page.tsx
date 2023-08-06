"use client";
import { FormEvent } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const name = e.currentTarget.username.value;
    const password = e.currentTarget.password.value;

    try {
      const { data } = await supabase.auth.signUp({ email, password });

      const id = data.user?.id;
      await axios.post("/api/user", {
        email,
        name,
        id,
      });
      window.alert("check your email");
      // Set the values to empty
      e.currentTarget.email.value = "";
      e.currentTarget.username.value = "";
      e.currentTarget.password.value = "";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex px-4 flex-col justify-center items-center h-[calc(100vh-112px)]">
      <form
        onSubmit={handleSubmit}
        className="border p-6 rounded-lg bg-neutral shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <input
          type="text"
          className="border border-accent bg-ice text-primary rounded p-2 mb-2 w-full bg-neutral"
          name="username"
          placeholder="Username"
        />
        <input
          type="text"
          className="border border-accent bg-ice text-primary rounded p-2 mb-2 w-full bg-neutral"
          name="email"
          placeholder="Email"
        />
        <div className="py-2">
          <input
            className="border bg-neutral border-accent bg-ice text-primary rounded p-2 mb-2 w-full"
            type={showPassword ? "text" : "password"}
            name="password"
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
          className="bg-secondary py-2 text-white rounded p-2 w-full"
        >
          Submit
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
