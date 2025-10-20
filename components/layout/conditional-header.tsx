"use client";

import Header from "@/components/layout/header";
import PublicHeader from "@/components/layout/public-header";
import { useCurrentUser } from "@/services/auth.mutations";
import { Suspense } from "react";

export default function ConditionalHeader() {
  const { data: currentUser, isLoading } = useCurrentUser();

  // Show loading state or default to public header while loading
  if (isLoading) {
    return (
      <Suspense>
        <PublicHeader />
      </Suspense>
    );
  }

  // If user is authenticated, show the authenticated header
  if (currentUser?.user) {
    return (
      <Suspense>
        <Header />
      </Suspense>
    );
  }

  // If no user, show public header
  return (
    <Suspense>
      <PublicHeader />
    </Suspense>
  );
}
