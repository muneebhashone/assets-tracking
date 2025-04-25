import ChangelogListPage from "@/components/page-client/ChangelogListPage";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fratezone - Changelogs",
  description: "View system changelogs and updates",
};

const ChangelogsPage = () => {
  return <ChangelogListPage />;
};

export default ChangelogsPage;
