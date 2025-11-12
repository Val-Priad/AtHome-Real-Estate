import { verifyUser } from "@/lib/api/verify";
import { redirect } from "next/navigation";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  if (!token) return <div>❌ Missing token</div>;

  const result = await verifyUser(token);

  if (result.success) {
    redirect("/login");
  }

  return <div className="mt-12 text-center">❌ {result.error}</div>;
}
