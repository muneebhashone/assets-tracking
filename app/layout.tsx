import Providers from "@/components/layout/providers";
import { ReactQueryClientProvider } from "@/components/layout/react-query-provider";
import { currentUser } from "@/services/auth.services";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Suspense } from "react";
import { AUTH_KEY } from "@/utils/constants";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700", "800"],
  preload: true,
  display: "auto",
});

export const metadata: Metadata = {
  title: "Fratezone",
  description:
    "FrateZone - Your comprehensive logistics platform for seamless shipment tracking, management and collaboration across global supply chains",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      {
        url: "/favicon/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon/favicon.ico"],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/favicon.ico",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  // Only prefetch user data if we have an auth token
  const authToken = cookies().get(AUTH_KEY)?.value;
  if (authToken) {
    await queryClient.prefetchQuery({
      queryKey: ["currentUser"],
      queryFn: () => currentUser(authToken),
    });
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} overflow-hidden`}
        cz-shortcut-listen="true"
      >
        <Suspense>
          <ReactQueryClientProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Providers>{children}</Providers>
            </HydrationBoundary>
          </ReactQueryClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
