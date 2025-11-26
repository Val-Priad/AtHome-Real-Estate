import { getAgentsTable } from "@/lib/actions/user/getAgentsTable";
import { AgentRow, columns } from "./components/columns";
import { DataTable } from "../components/DataTable";
import Sidebar from "../components/Sidebar";

export default async function AgentsPage() {
  const result = await getAgentsTable();

  if (!result.success) {
    return (
      <div className="p-6 text-red-600">
        Failed to load agents: {result.message}
      </div>
    );
  }

  const agents = result.data as AgentRow[];

  return (
    <div className="flex pt-10">
      <Sidebar />

      <main className="w-full px-10">
        <h1 className="mb-6 text-3xl font-bold">Agent Management</h1>
        <p className="text-muted-foreground mt-1">
          View and manage real estate agents.
        </p>
        <DataTable columns={columns} data={agents} />
      </main>
    </div>
  );
}
