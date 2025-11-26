import { getAllRegularUsers } from "@/lib/actions/user/getAllRegularUsers";
import { columns, UserRow } from "./components/columns";
import Sidebar from "../components/Sidebar";
import { DataTable } from "../components/DataTable";

export default async function UsersPage() {
  const result = await getAllRegularUsers();

  if (!result.success) {
    return (
      <div className="p-10 text-red-600">
        {result.message || "Failed to load users."}
      </div>
    );
  }

  const users = result.data as UserRow[];

  return (
    <div className="flex pt-10">
      <Sidebar />

      <main className="w-full px-10">
        <h1 className="mb-6 text-3xl font-bold">User Management</h1>

        <DataTable columns={columns} data={users} />
      </main>
    </div>
  );
}
