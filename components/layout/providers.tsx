"use client";
import React from "react";
import { Toaster } from "../ui/toaster";
import ThemeProvider from "./theme-provider";
import NextTopLoader from "nextjs-toploader";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <Toaster />
        <NextTopLoader showSpinner={false} color="#D3991F" />
        {children}
      </ThemeProvider>
    </>
  );
}
