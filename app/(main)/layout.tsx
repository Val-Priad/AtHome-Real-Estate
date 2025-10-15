import "@/app/globals.css";

import BodyWrapper from "@/components/layout/BodyWrapper";
import ClientNavigation from "@/components/layout/ClientNavigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "At Home: Estate Agency",
  description:
    "Your trusted partner for finding the perfect place to feel truly At Home. We make the journey of buying and selling property seamless and stress-free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <BodyWrapper>
        <ClientNavigation />
        {children}
      </BodyWrapper>
    </html>
  );
}
