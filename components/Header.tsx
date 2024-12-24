"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import { Menu as MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { menuitems } from "../constants/data";
import NavLogo from "./NavLogo";
import { UserNav } from "./layout/user-nav";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Header = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <NavLogo
            height={50}
            link={"/"}
            src="/images/logo.png"
            width={50}
            alt="logo"
          />
        </div>

  
        <nav className="hidden md:flex items-center gap-6">
          {menuitems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {currentUser?.user ? (
            <UserNav />
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/signin")}>
                Login
              </Button>
              <Button
                className="bg-blue-500"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </Button>
            </div>
          )}

         
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {menuitems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                {!currentUser?.user && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/signin")}
                    >
                      Login
                    </Button>
                    <Button
                      className="bg-blue-600"
                      onClick={() => router.push("/signup")}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
