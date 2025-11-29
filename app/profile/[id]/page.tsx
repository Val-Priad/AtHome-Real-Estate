import { getUserById } from "@/lib/actions/user/getUserById";

import PropertyPreviewCard from "@/components/Elements/PropertyPreviewCard";
import Pagination from "./components/Pagination";
import { getEstatesByAgentId } from "@/lib/actions/estate/getEstateByAgent";
import { redirect } from "next/navigation";
import { EstatePreview } from "@/lib/actions/estate/searchEstate";
import AgentHeader from "./components/AgentHeader";

const ITEMS_PER_PAGE = 20;

export default async function AgentPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const agentId = awaitedParams.id;
  const page = Number(awaitedSearchParams.page ?? "1");

  const agent = await getUserById(agentId);
  const estates = await getEstatesByAgentId(agentId);

  const totalItems = estates.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleItems = estates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!agent) redirect("/not-found");

  return (
    <div className="flex justify-center px-2 py-6">
      <div className="w-full max-w-7xl">
        <AgentHeader agent={agent} />

        <h2 className="text-brand-9 mt-3 mb-6 text-2xl font-semibold">
          Estates from {agent.name} ({totalItems} ads)
        </h2>

        {estates.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            This agent has no estates.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((p: EstatePreview) => (
                <PropertyPreviewCard key={p.id} property={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                agentId={agentId}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
