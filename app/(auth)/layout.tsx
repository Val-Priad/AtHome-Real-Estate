import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user.role) {
    redirect("/");
  }

  return (
    <div className="mt-80 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-red-50 p-6">
        {children}
      </div>
    </div>
  );
}
