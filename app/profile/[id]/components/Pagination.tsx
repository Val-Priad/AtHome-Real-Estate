"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  totalPages,
  agentId,
}: {
  page: number;
  totalPages: number;
  agentId: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function goToPage(newPage: number) {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", String(newPage));
    router.replace(`/profile/${agentId}?${newParams.toString()}`);
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className={`rounded-lg px-4 py-2 text-sm ${
          page <= 1 ? "bg-gray-300 text-gray-500" : "bg-white hover:bg-gray-200"
        }`}
      >
        Previous
      </button>

      <span className="text-sm text-gray-700">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
        className={`rounded-lg px-4 py-2 text-sm ${
          page >= totalPages
            ? "bg-gray-300 text-gray-500"
            : "bg-white hover:bg-gray-200"
        }`}
      >
        Next
      </button>
    </div>
  );
}
