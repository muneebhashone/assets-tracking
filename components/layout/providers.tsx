"use client";
import React from "react";
import { Toaster as RadixToaster } from "../ui/toaster";
import { Toaster } from "../ui/sonner";
import ThemeProvider from "./theme-provider";
import NextTopLoader from "nextjs-toploader";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <RadixToaster />
        <Toaster />
        <NextTopLoader showSpinner={false} color="#D3991F" />
        {children}
      </ThemeProvider>
    </>
  );
}
