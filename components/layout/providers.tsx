"use client";
import React from "react";
import { ReactQueryClientProvider } from "../ReactQueryClientProvider";
import { Toaster } from "../ui/toaster";
import ThemeProvider from "./ThemeToggle/theme-provider";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <Toaster />
        {children}
      </ThemeProvider>
    </>
  );
}
