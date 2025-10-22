"use client";
import { useSearchParams } from "next/navigation";

function Page() {
  const params = useSearchParams();
  return <div>{params.toString()}</div>;
}

export default Page;
