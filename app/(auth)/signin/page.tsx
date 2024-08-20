import UserAuthForm from "@/components/forms/user-auth-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
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
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-[#3491fe]" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href={"/"}>
            <Image src={"/images/logo.png"} alt="logo" width={60} height={60} />
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
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
