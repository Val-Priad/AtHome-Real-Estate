import { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
