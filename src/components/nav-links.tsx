// Links.js
import React from "react";
import Link from "next/link";

interface LinkData {
  name: string;
  link: string;
}

const NavLinks = ({ links }:{links:Array<LinkData>}) => {
  return (
    <ul className="flex flex-col md:flex-row md:justify-center">
      {links.map((el) => (
        <li
          key={el.link}
          className=" text-primary px-[15px] hover:text-secondary cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[13px] bg-base-100"
        >
          <Link href={el.link}>{el.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
