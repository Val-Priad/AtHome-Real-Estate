import "@/styles/globals.css";
import type { Metadata } from "next";
import NavigationContainer from "@/components/layout/NavigationContainer";

export const metadata: Metadata = {
  title: "At Home: Estate Agency",
  description:
    "Your trusted partner for finding the perfect place to feel truly At Home. We make the journey of buying and selling property seamless and stress-free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavigationContainer />
        {children}
      </body>
    </html>
  );
}
