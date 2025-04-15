"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { menuitems } from "../constants/data";
import LoginButton from "./LoginButton";
import Menu from "./Menu";
import NavLogo from "./NavLogo";
import { UserNav } from "./layout/user-nav";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { status } = useSession();

  return (
    <>
      <div className="flex-row md:flex items-center justify-between bg-[#FFFFFF] fixed w-full px-5 md:px-20 lg:px-60 z-[9999] shadow-lg">
        <div className="flex items-center justify-between">
          <NavLogo
            height={60}
            link={"/"}
            src="/images/logo.png"
            width={60}
            alt="logo"
          />
          <button onClick={() => setOpen(!open)}>
            <HamburgerMenuIcon className="md:hidden w-8 h-8" />
          </button>
        </div>
        <div className="flex-row md:flex items-center gap-28">
          <Menu
            className={`${open ? "block" : "hidden"}`}
            listitem={menuitems}
          />
          <div className="flex items-center gap-10 justify-center">
            {status === "authenticated" ? (
              <>
                <UserNav />
              </>
            ) : (
              <>
                <Link href="/signin" passHref>
                  <LoginButton
                    title="Login"
                    classname={cn(
                      "bg-transparent text-[#3491FE] font-medium md:block",
                      open ? "block" : "hidden",
                    )}
                  />
                </Link>
                <Link href="/signup" passHref>
                  <LoginButton
                    title="Sign Up"
                    classname={cn(
                      "bg-[#3491FE] text-white font-medium md:block",
                      open ? "block" : "hidden",
                    )}
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default Header;
