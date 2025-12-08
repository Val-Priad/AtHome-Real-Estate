import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log(session?.user);

  if (!session?.user) {
    redirect("/login");
  }

  if (!["agent", "admin"].includes(session.user.role)) {
    redirect("/not-found");
  }

  return <>{children}</>;
}
