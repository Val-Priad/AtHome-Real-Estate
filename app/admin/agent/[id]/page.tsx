import { getUserById } from "@/lib/actions/user/getUserById";
import EditAgentForm from "./components/EditAgentForm";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const agent = await getUserById(id);

  if (!agent) {
    return <div className="p-6 text-red-600">Agent not found</div>;
  }

  return (
    <div className="flex justify-center pt-10">
      <EditAgentForm agent={agent} />
    </div>
  );
}
