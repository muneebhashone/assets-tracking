import { AUTH_KEY } from "@/utils/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type props = {
  children: React.ReactNode;
};
export default function AuthLayout({ children }: props) {
  const cookieValue = cookies().get(AUTH_KEY)?.value;
  const accessToken = Boolean(cookieValue && cookieValue !== "undefined");
  if (accessToken) {
    redirect("/dashboard");
  }
  return <Suspense>{children}</Suspense>;
}
