import "@/styles/globals.css";

import BodyWrapper from "@/components/layout/BodyWrapper";
import ClientNavigation from "@/components/layout/ClientNavigation";
import { i18n, type Locale } from "@/i18n-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "At Home: Estate Agency",
  description:
    "Your trusted partner for finding the perfect place to feel truly At Home. We make the journey of buying and selling property seamless and stress-free.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <BodyWrapper>
        <ClientNavigation lang={lang} />
        {children}
      </BodyWrapper>
    </html>
  );
}
