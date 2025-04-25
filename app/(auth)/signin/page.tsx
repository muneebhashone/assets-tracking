import UserAuthForm from "@/components/forms/user-auth-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Truck, Package, BoxesIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Fratezone - Sign In",
  description: "Login to FrateZone",
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 hidden top-4 md:right-8 md:top-8",
        )}
      >
        Login
      </Link>
      <div
        className="relative hidden h-full flex-col bg-muted p-10 bg-cover bg-center text-white lg:flex"
        style={{ backgroundImage: "url('/images/bg-image.png')" }}
      >
        {/* Use background image from assets */}

        {/* <div className="absolute inset-0">
          <Truck className="absolute opacity-5 w-64 h-64 -right-10 top-10 rotate-12" />
          <Package className="absolute opacity-5 w-48 h-48 left-10 bottom-1/4" />
          <BoxesIcon className="absolute opacity-5 w-56 h-56 right-1/4 bottom-10 -rotate-12" />
        </div> */}
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative z-20 flex items-center justify-center text-lg font-medium">
            <Link href={"/"} className="hover:opacity-80 transition-opacity">
              <Image
                src={"/images/logo.png"}
                alt="logo"
                width={480}
                height={480}
                className="drop-shadow-xl"
              />
            </Link>
          </div>

          <div className="relative text-center z-20 mt-10">
            {/* <h1 className="text-4xl font-bold mb-6">
              Fast & Reliable Shipping
            </h1>
            <p className="text-xl text-white/80 max-w-md">
              Track your shipments, manage deliveries, and ensure your packages
              arrive safely and on time.
            </p> */}
            <p className="text-xl text-white/80 font-thin ">
              &quot;When you need an eyes on your shipment at all times&quot;
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login your account
            </p>
          </div>
          <UserAuthForm />
          <Link href="/signup" className="text-[#3491FE]">
            Create an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
