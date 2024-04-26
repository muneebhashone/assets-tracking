import useUserStore from "@/lib/userDataStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const UnAuthWrapper = ({ children }: Props) => {
  const router = useRouter();
  const { currentUser } = useUserStore((state) => state);

  useEffect(() => {
    if(!currentUser?.email) return

    router.push("/dashboard")
  }, [currentUser]);

  return !currentUser?.email ? <>{children}</> : null;
};

export default UnAuthWrapper;
