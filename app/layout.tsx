import Providers from "@/components/layout/providers";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

//
