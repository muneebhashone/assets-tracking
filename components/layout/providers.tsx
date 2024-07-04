"use client";
import React from "react";
import { Toaster } from "../ui/toaster";
import ThemeProvider from "./theme-provider";
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
