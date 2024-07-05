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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: [currentUser.name],
    queryFn: () => currentUser(cookies().get("accessToken")?.value),
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} `}>
        <ReactQueryClientProvider>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Providers>{children}</Providers>
          </HydrationBoundary>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}

//
