import ProfileSettingPage from "@/components/page-client/ProfileSettingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fratezone - Profile Settings",
  description: "Manage your profile settings",
};

export default function Settings() {
  return <ProfileSettingPage />;
}
