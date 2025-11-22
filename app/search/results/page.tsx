"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfigureFilters from "./components/ConfigureFilters";
import PropertyPreviewCard from "@/components/Elements/PropertyPreviewCard";
import {
  FilteredEstatePreview,
  getEstateByFilters,
} from "@/lib/actions/estate/getEstateByFilters";

const ITEMS_PER_PAGE = 20;

function Page() {
  const params = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<FilteredEstatePreview[]>([]);
  const [loading, setLoading] = useState(true);

  const queryString = params.toString();

  const page = Number(params.get("page") ?? "1");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getEstateByFilters(queryString);
      setProperties(data);
      setLoading(false);
    }

    loadData();
  }, [queryString]);

  const totalItems = properties.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleItems = properties.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Pagination navigation function
  const goToPage = (newPage: number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", String(newPage));
    router.push(`?${newParams.toString()}`);
  };

  // HEADLINE LOGIC (unchanged)
  const propertyType = params.get("property_type");
  const offerType = params.get("offer_type");
  const regions = params.getAll("region");
  const floorPlan = params.getAll("floor_plan");
  const houseSize = params.getAll("house_size");

  const propertyLabel =
    propertyType === "apartment"
      ? "Apartments"
      : propertyType === "house"
        ? "Houses"
        : "Properties";

  const offerLabel =
    offerType === "lease" ? "for rent" : offerType === "sale" ? "for sale" : "";

  const locationLabel = regions.length > 0 ? `in ${regions.join(", ")}` : "";

  const planLabel =
    propertyType === "apartment" && floorPlan.length > 0
      ? `(${floorPlan.join(", ")})`
      : propertyType === "house" && houseSize.length > 0
        ? `(${houseSize.join(", ")})`
        : "";

  const headline = [propertyLabel, planLabel, offerLabel, locationLabel]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex justify-center px-2 py-6">
      <div className="w-full max-w-7xl">
        <div className="border-brand-6 rounded-2xl border bg-stone-100 px-4 py-6 md:px-6 lg:px-8">
          <ConfigureFilters queryString={queryString} />

          <h1 className="text-brand-10 mb-2 text-2xl font-semibold md:text-3xl">
            {headline || "All properties"}
          </h1>

          {loading ? (
            <p className="mb-8 text-gray-600">Loading...</p>
          ) : (
            <p className="mb-8 text-gray-600">
              {totalItems} {totalItems === 1 ? "property" : "properties"} found
            </p>
          )}

          {/* RESULTS */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleItems.map((property) => (
                  <PropertyPreviewCard key={property.id} property={property} />
                ))}
              </div>

              {/* PAGINATION */}
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
    </div>
  );
}

export default Page;
