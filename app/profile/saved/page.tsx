"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import PropertyPreviewCard from "@/components/Elements/PropertyPreviewCard";
import { getSavedEstate } from "@/lib/actions/estate/getSavedEstate";
import { EstatePreview } from "@/lib/actions/estate/searchEstate";

const ITEMS_PER_PAGE = 20;

export default function SavedPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<EstatePreview[]>([]);
  const [loading, setLoading] = useState(true);

  const page = Number(params.get("page") ?? "1");

  useEffect(() => {
    async function load() {
      setLoading(true);

      const data = await getSavedEstate();
      setProperties(data);

      setLoading(false);
    }

    load();
  }, []);

  const totalItems = properties.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleItems = properties.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  function goToPage(newPage: number) {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", String(newPage));
    router.replace(`/profile/saved?${newParams.toString()}`);
  }

  return (
    <div className="flex justify-center px-2 py-6">
      <div className="w-full max-w-7xl">
        <h1 className="text-brand-10 mb-6 text-3xl font-semibold">
          Saved Estates
        </h1>

        {loading ? (
          <p className="mb-8 text-gray-600">Loading...</p>
        ) : (
          <p className="mb-8 text-gray-600">
            {totalItems} {totalItems === 1 ? "property" : "properties"} saved
          </p>
        )}

        {/* Empty */}
        {!loading && totalItems === 0 && (
          <div className="py-10 text-center text-lg text-gray-500">
            You have no saved estates.
          </div>
        )}

        {/* Results */}
        {!loading && totalItems > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((p) => (
                <PropertyPreviewCard key={p.id} property={p} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    page <= 1
                      ? "cursor-not-allowed bg-gray-300 text-gray-500"
                      : "bg-white text-gray-700 hover:bg-gray-200"
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
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    page >= totalPages
                      ? "cursor-not-allowed bg-gray-300 text-gray-500"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
