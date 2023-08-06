"use client";
import { useContext } from "react";

import { AuthContext } from "@/contexts/AuthContext";

export default function SignOut() {
  const { logout } = useContext(AuthContext);

  return (
    <button type="button" className="button-inverse" onClick={logout}>
      Sign Out
    </button>
  );
}
