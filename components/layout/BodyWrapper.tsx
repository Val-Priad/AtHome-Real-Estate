"use client";
import bg from "../../public/villa_20.webp";
import { usePathname } from "next/navigation";

function BodyWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  console.log(path);
  const isRoot = path === "/en" || path === "/ua";
  const bodyStyle = isRoot
    ? {
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100dvh",
      }
    : undefined;

  return <body style={bodyStyle}>{children}</body>;
}

export default BodyWrapper;
