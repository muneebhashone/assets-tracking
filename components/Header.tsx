"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { menuitems } from "../constants/data";
import LoginButton from "./LoginButton";
import Menu from "./Menu";
import NavLogo from "./NavLogo";
import { UserNav } from "./layout/user-nav";

const Header = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleOpen = () => {
    setOpen(!open);
  };
  const { data: currentUser } = useCurrentUser();
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
          <button onClick={handleOpen}>
            <HamburgerMenuIcon className="md:hidden w-8 h-8" />
          </button>
        </div>
        <div className="flex-row md:flex items-center gap-28">
          <Menu
            className={`${open ? "block" : "hidden"}`}
            listitem={menuitems}
          />
          <div className="flex items-center gap-10 justify-center">
            {currentUser?.user ? (
              <UserNav />
            ) : (
              <>
                <Link href="/signin">
                  <LoginButton
                    title="Login"
                    classname={`bg-transparent text-[#3491FE] font-medium md:block ${
                      open ? "block" : "hidden"
                    }`}
                  />
                </Link>
                <LoginButton
                  onclick={() => router.push("/signup")}
                  title="Sign Up"
                  classname={`bg-[#3491FE] text-white font-medium md:block ${
                    open ? "block" : "hidden"
                  }`}
                />
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
