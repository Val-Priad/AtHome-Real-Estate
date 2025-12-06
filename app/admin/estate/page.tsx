import { getEstateTable } from "@/lib/actions/estate/getEstateTable";
import { columns } from "./components/columns";
import { DataTable } from "../components/DataTable";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

export default async function EstatesPage() {
  const session = await auth();
  const user = session?.user;
  const isAgent = user?.role === "agent";

  const data = await getEstateTable();

  if (!data) {
    return <div className="p-10 text-red-600">Failed to load data</div>;
  }
  console.log(data);

  const filteredData = isAgent
    ? data.filter((estate) => estate.agentId === user.id)
    : data;

  return (
    <div className="flex flex-col gap-2 pt-10 sm:flex-row sm:gap-0">
      <Sidebar />

      <main className="w-full px-10">
        <h1 className="mb-6 text-3xl font-bold">Estate Management</h1>

        {!isAgent && (
          <Link href="/estate/add" className="mb-3 block">
            <Button>Add estate</Button>
          </Link>
        )}

        <DataTable columns={columns} data={filteredData} />
      </main>
    </div>
  );
}
