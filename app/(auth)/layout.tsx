import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type props = {
  children: React.ReactNode;
};
export default function AuthLayout({ children }: props) {
  const cookieValue = cookies().get("accessToken")?.value;
  const accessToken = Boolean(cookieValue && cookieValue !== "undefined");
  if (accessToken) {
    redirect("/dashboard");
  }
  return <Suspense>{children}</Suspense>;
}
