"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLink = ({ href, children, className = "", ...props }) => {
  const path = usePathname();

  const isActive = href === "/" ? path === "/" : path.startsWith(href);

  const activeStyles = "text-primary !bg-secondary font-medium";
  const baseStyles =
    "py-3 hover:text-primary transition-colors bg-transparent hover:bg-transparent";

  return (
    <Link
      href={href}
      className={`${baseStyles} ${className} ${isActive ? activeStyles : ""}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
