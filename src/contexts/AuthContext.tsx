"use client";
import { Cookies } from "@/utils/helpers";
import { supabase } from "@/utils/supabase";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { deleteCookie, setCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User } from "@/utils/types";

interface AuthContextProps {
  authenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>; // Updated type annotation
  logout: () => void;
  user?: User;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      // Check if the user is already logged in based on cookies - token must be verified anyway in api call
      const info = await Cookies();
      const isLoggedIn = !!info?.id;
      setUser(info);
      setAuthenticated(isLoggedIn);
    };

    fetchData();
  }, []);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    // Perform login logic, set authenticated to true
    try {
      const { data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data?.user) {
        const user = await axios.get("/api/user", {
          params: {
            userId: data.user.id,
          },
        });
        console.log('user', user)
        const info = {
          authenticated: true,
          user,
        };

        setAuthenticated(true);

        setUser(info?.user?.data?.user);

        const token = await axios.post("/api/token", {
          info: info?.user?.data?.user,
        });

        setCookie(
          "supabase-auth",
          { token: token.data.token },
          { maxAge: 60 * 6 * 24 },
        );

        router.push("/");
        return true; // Return true to indicate successful login
      } else {
        throw new Error("Error authenticating");
      }
    } catch (err) {
      console.log(err);
      throw new Error("error");
    }
  };

  const logout = async () => {
    // Perform logout logic, set authenticated to false
    await supabase.auth.signOut();
    setAuthenticated(false);
    deleteCookie("supabase-auth");
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
