import Image from "next/image";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function PublicHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href={"/"}>
            <Image
              src={"/images/logo.png"}
              alt="logo"
              width={120}
              height={120}
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href={"/signin"}>
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
              Sign In
            </button>
          </Link>
          <Link href={"/signup"}>
            <button className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md">
              Sign Up
            </button>
          </Link>
          <Link href={"/support-request"}>
            <HelpCircle className="h-5 w-5 text-gray-600 hover:text-gray-900" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
