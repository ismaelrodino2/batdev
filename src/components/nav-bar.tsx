"use client";
import React, { useContext } from "react";
import { Box, IconButton } from "@mui/material";
import { MdBrightness4, MdBrightnessHigh } from "react-icons/md";
import { SearchContext } from "@/contexts/SearchContext";
import { DarkModeContext } from "@/contexts/DarkModeContext";
import AnimateHeight from "react-animate-height";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { MuiContext } from "@/contexts/MuiContext";

import Link from "next/link";
import { AuthContext } from "@/contexts/AuthContext";
import { linksAuth, linksNotAuth } from "@/utils/helpers";
import NavLinks from "./nav-links";

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { darkModeValue, setDarkModeValue } = React.useContext(DarkModeContext);

  const [active, setActive] = React.useState<"auto" | number | `${number}%`>(0);
  const [activeUser, setActiveUser] = React.useState<
    "auto" | number | `${number}%`
  >(0);
  const [activeSearch, setActiveSearch] = React.useState<
    "auto" | number | `${number}%`
  >(0);

  const { user, logout } = useContext(AuthContext);

  const { setSearchValue } = useContext(SearchContext);
  const { setDarkTheme, darkTheme } = useContext(MuiContext);

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (pathname !== "/") {
      router.push("/");
    }
    setSearchValue(e.target.value);
  };

  const handleDark = () => {
    setDarkModeValue(!darkModeValue);
    setDarkTheme(!darkTheme);
  };

  return (
    <div className="bg-white px-5" data-testid="bg">
      <style jsx={true}>
        {`
          .custom-underline::after {
            content: "";
            position: absolute;
          }

          .box-animation .custom-underline::after {
            top: 120%;
            height: 1px !important;
            width: 40%;
            left: 30%;
            transition: 0.4s ease-out all 0.1s;
            background-color: #222222;
            transition: 0.3s ease all 0.1s;
          }

          .box {
            transition: all 2s ease-in-out;
          }

          .box:hover {
            cursor: pointer;
          }

          .box-animation:hover .custom-underline::after {
            width: 100%;
            left: 0%;
            background-color: #74c2bd;
            transition: 0.5s ease all;
          }
        `}
      </style>
      <ul className="flex items-center flex-wrap font-extrabold raleway text-[13px] min-h-16 py-3">
        <li className="flex md:hidden items-center w-full md:w-1/3 justify-center md:order-2 py-2 md:py-0 ">
          <h2 className="cursor-pointer transition-opacity duration-300 ease-in-out opacity-100 hover:opacity-60">
            <Link href="/">Batdev</Link>
          </h2>
        </li>
        <div
          className="flex w-full justify-between items-center"
          data-testid="searchButton"
        >
          <li className="uppercase w-auto flex md:w-1/3 justify-center md:justify-start md:order-1 tracking-[2px]">
            <div className="box-animation">
              <span
                className="custom-underline relative inline-block cursor-pointer transition-colors duration-300 ease-in-out text-primary hover:text-secondary"
                onClick={() => {
                  setActiveSearch(activeSearch === 0 ? "auto" : 0);
                  setActive(0);
                  setActiveUser(0);
                }}
              >
                search
              </span>
            </div>
          </li>

          <li className="md:flex hidden items-center w-full md:w-1/3 justify-center md:order-2 py-2 md:py-0 ">
            <h2 className="cursor-pointer transition-opacity duration-300 ease-in-out opacity-100 hover:opacity-60">
              <Link href="/">Batdev</Link>
            </h2>
          </li>

          <ul className="md:flex contents w-auto justify-center md:justify-end md:w-1/3 md:order-3 tracking-[2px] items-center">
            <li data-testid="darkMode">
              {" "}
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  p: 3,
                }}
                className="bg-white text-primary"
              >
                <IconButton sx={{ ml: 1 }} onClick={handleDark} color="inherit">
                  {darkModeValue ? <MdBrightness4 /> : <MdBrightnessHigh />}
                </IconButton>
              </Box>
            </li>
            <li className="uppercase text-primary px-[15px] ">
              {user ? (
                <Image
                  onClick={() => {
                    setActiveUser(activeUser === 0 ? "auto" : 0);
                    setActiveSearch(0);
                    setActive(0);
                  }}
                  className="h-[30px] w-[30px] cursor-pointer rounded-full border border-[transparent] hover:border-secondary"
                  src={
                    user?.avatarUrl ||
                    process.env.NEXT_PUBLIC_GENERIC_AVATAR ||
                    ""
                  }
                  blurDataURL={"/user.svg"}
                  placeholder="blur"
                  alt={`Profile picture`}
                  width={100}
                  height={100}
                />
              ) : null}
              {!user ? (
                <div className="box-animation">
                  <span className="custom-underline relative inline-block text-center transition-colors duration-300 ease-in-out text-primary hover:text-secondary cursor-pointer">
                    <Link href="/signin">sign in</Link>
                  </span>
                </div>
              ) : null}
            </li>
            <li className="uppercase text-primary px-[15px]  ">
              <div className="box-animation">
                <span
                  className="custom-underline relative inline-block text-center transition-colors duration-300 ease-in-out text-primary hover:text-secondary cursor-pointer"
                  onClick={() => {
                    setActive(active === 0 ? "auto" : 0);
                    setActiveSearch(0);
                    setActiveUser(0);
                  }}
                >
                  menu
                </span>
              </div>
            </li>
          </ul>
        </div>
      </ul>

      <AnimateHeight duration={500} height={active}>
        <ul className="flex flex-col md:flex-row md:justify-center">
        {user ? <NavLinks links={linksAuth} /> : <NavLinks links={linksNotAuth} />}

        </ul>
      </AnimateHeight>

      <AnimateHeight duration={500} height={activeUser}>
        <div className="flex justify-center">
          <ul className="py-1 w-full text-center">
            <li className="text-primary px-[15px] hover:text-secondary cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[13px] bg-base-100">
              <Link href="/profile">My profile</Link>
            </li>
            <li
              onClick={logout}
              className="text-primary px-[15px] hover:text-secondary cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[12px] bg-base-100 flex justify-center"
            >
              Sign out
            </li>
          </ul>
        </div>
      </AnimateHeight>

      <AnimateHeight duration={500} height={activeSearch}>
        <div className="flex justify-center ">
          <input
            type="text"
            placeholder="Search for a title..."
            className="outline-none bg-white py-4 text-center"
            onChange={search}
            data-testid="search"
          />
        </div>
      </AnimateHeight>
    </div>
  );
};

export default NavBar;
