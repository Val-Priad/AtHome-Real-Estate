"use client";
import { usePathname } from "next/navigation";

function BodyWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const isRoot = path === "/";
  const bodyClassName = isRoot
    ? "bg-[url('/villa_20.webp')] bg-cover bg-center h-dvh bg-stone-100"
    : "";
  return <body className={bodyClassName}>{children}</body>;
}

export default BodyWrapper;
