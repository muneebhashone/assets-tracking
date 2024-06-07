import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { InitializeSocket } from "@/stores/useSocketStore";
import { auth } from "@/lib/auth-options";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700", "800"],
  preload: true,
  display: "auto",
});

export const metadata: Metadata = {
  title: "FRATE ZONE",
  description: "Find your shipment by one click",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} `}>
        <Providers session={session}>
          <Toaster />
          <InitializeSocket />
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </Providers>
      </body>
    </html>
  );
}

//
