import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";

type props = {
  children: React.ReactNode;
};
export default function AuthLayout({ children }: props) {
  const cookieValue = cookies().get("accessToken")?.value;
  const accessToken = Boolean(cookieValue && cookieValue !== "undefined");
  if (accessToken) {
    redirect("/dashboard");
    return <div>Redirecting...</div>;
  }
  return (
    <Suspense>
      <NextTopLoader showSpinner={false} color="#D3991F" />
      {children}
    </Suspense>
  );
}
