
import useUserStore from "@/lib/userDataStore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
type Props = {
  children: React.ReactNode;
};

const AuthWrapper = ({ children }: Props) => {
  const router = useRouter();
  const { currentUser } = useUserStore();
  useEffect(() => {
    if (currentUser) {
      return
      // handeDoc(currentUser?.uid);
    }
    else {
      router.push("/auth/signin")
    }
  }, [currentUser]);

  return currentUser?.email && <div>{children}</div>;
};

export default AuthWrapper;
