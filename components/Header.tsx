"use client";

import React, { useEffect, useState } from "react";
import NavLogo from "./NavLogo";
import Menu from "./Menu";
import { menuitems } from "../constants/data";
import LoginButton from "./LoginButton";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserNav } from "./layout/user-nav";



const Header = () => {

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleOpen = () => {
    setOpen(!open);
  };
  const { status } = useSession();

  return (
    <>

      <div
        className="flex-row md:flex items-center justify-between bg-[#FFFFFF] fixed w-full px-5 md:px-20 lg:px-60 z-[9999] shadow-lg">
        <div className="flex items-center justify-between">
          <NavLogo
            height={60}
            link={"/"}
            src="/images/logo.png"
            width={60}
            alt="logo"
          />
          <button onClick={handleOpen}>
            <HamburgerMenuIcon className="md:hidden w-8 h-8" />
          </button>
        </div>
        <div className="flex-row md:flex items-center gap-28">
          <Menu className={`${open ? "block" : "hidden"}`} listitem={menuitems} />
          <div className="flex items-center gap-10 justify-center">

            {status === "authenticated" ? <>
                <UserNav />
              </> :
              <>
                <LoginButton
                  onclick={() => router.push("/signin")}
                  title="Login"
                  classname={`bg-transparent text-[#3491FE] font-medium md:block ${open ? "block" : "hidden"
                  }`}
                />
                <LoginButton
                  onclick={() => router.push("/signup")}
                  title="Sign Up"
                  classname={`bg-[#3491FE] text-white font-medium md:block ${open ? "block" : "hidden"
                  }`}
                />
              </>
            }
          </div>
        </div>
      </div>
      ;
    </>
  )
    ;
};

export default Header;
