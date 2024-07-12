import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import { HelpCircle } from "lucide-react";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href={"/"}>
            <Image src={"/images/logo.png"} alt="logo" width={60} height={60} />
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav  />
          <Link href={"/support-request"}>
            <HelpCircle />
          </Link>
        </div>
      </nav>
    </div>
  );
}
