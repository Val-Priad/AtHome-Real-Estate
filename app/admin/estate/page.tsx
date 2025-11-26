import { getEstateTable } from "@/lib/actions/estate/getEstateTable";
import { columns } from "./components/columns";
import { DataTable } from "../components/DataTable";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EstatesPage() {
  const data = await getEstateTable();

  if (!data) {
    return <div className="p-10 text-red-600">Failed to load data</div>;
  }

  return (
    <div className="flex pt-10">
      <Sidebar />

      <main className="w-full px-10">
        <h1 className="mb-6 text-3xl font-bold">Estate Management</h1>

        <Link href="/estate/add" className="mb-3 block">
          <Button> Add estate</Button>
        </Link>
        <DataTable columns={columns} data={data} />
      </main>
    </div>
  );
}
