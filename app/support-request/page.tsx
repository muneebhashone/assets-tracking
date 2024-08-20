import CreateSupportForm from "@/components/forms/create-support-request";
import { currentUser } from "@/services/auth.services";
import { cookies } from "next/headers";
import React from "react";

const page = async () => {
  let user;
  try {
    user = (await currentUser(cookies().get("accessToken")?.value))?.user;
  } catch (err) {}
  return <CreateSupportForm currentUser={user} />;
};

export default page;
