"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { EstatePreview, searchEstate } from "@/lib/actions/estate/searchEstate";
import PropertyPreviewCard from "@/components/Elements/PropertyPreviewCard";

import type { CheckboxStateType, InputStateType } from "../page";
import ConfigureFilters from "./components/ConfigureFilters";

const ITEMS_PER_PAGE = 20;

const EMPTY_ESTATE: CheckboxStateType["estate"] = {
  region: [],
  offerType: [],
  condition: [],
  energyClass: [],
  accessories: [],
};

const EMPTY_APARTMENT: CheckboxStateType["estateApartment"] = {
  flatClass: [],
  buildingType: [],
  apartmentPlan: [],
  accessories: [],
};

const EMPTY_HOUSE: CheckboxStateType["estateHouse"] = {
  houseCategory: [],
  housePlan: [],
  houseType: [],
  accessories: [],
};

const EMPTY_MULTI: CheckboxStateType["multiselect"] = {
  waterHeatSource: [],
  internetConnections: [],
};

const EMPTY_VICINITY: CheckboxStateType["vicinity"] = {
  facilitiesNearby: [],
};

// Final payload type (exactly what server action expects)
type SearchPayload = InputStateType &
  CheckboxStateType & {
    estateType: "apartment" | "house" | null;
  };

export default function ResultsPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<EstatePreview[]>([]);
  const [loading, setLoading] = useState(true);

  const page = Number(params.get("page") ?? "1");
  const normalizeQueryParams = useCallback((): SearchPayload => {
    const temp: {
      estateType?: "apartment" | "house" | null;
      primitives: Record<string, string>;
      groups: Partial<
        Record<keyof CheckboxStateType, Record<string, string[]>>
      >;
      numeric: Record<string, number>;
    } = {
      primitives: {},
      groups: {},
      numeric: {},
    };

    const checkboxSections: (keyof CheckboxStateType)[] = [
      "estate",
      "estateApartment",
      "estateHouse",
      "multiselect",
      "vicinity",
    ];

    const numericKeys: (keyof InputStateType)[] = [
      "usableAreaFrom",
      "usableAreaTo",
      "priceFrom",
      "priceTo",
    ];

    for (const [key, value] of params.entries()) {
      if (key.includes(".")) {
        const [section, inner] = key.split(".");
        if (checkboxSections.includes(section as keyof CheckboxStateType)) {
          const s = section as keyof CheckboxStateType;

          if (!temp.groups[s]) temp.groups[s] = {};
          if (!temp.groups[s]![inner]) temp.groups[s]![inner] = [];

          temp.groups[s]![inner]!.push(value);
        }
        continue;
      }

      if (key === "estateType") {
        temp.estateType = value as "apartment" | "house" | null;
        continue;
      }

      if (numericKeys.includes(key as keyof InputStateType)) {
        const n = Number(value);
        if (!isNaN(n)) temp.numeric[key] = n;
        continue;
      }

      temp.primitives[key] = value;
    }

    const result: SearchPayload = {
      aiSearch: temp.primitives.aiSearch,
      distanceToFacilities: temp.primitives.distanceToFacilities,

      usableAreaFrom: temp.numeric.usableAreaFrom,
      usableAreaTo: temp.numeric.usableAreaTo,
      priceFrom: temp.numeric.priceFrom,
      priceTo: temp.numeric.priceTo,

      estate: {
        ...EMPTY_ESTATE,
        ...(temp.groups.estate ?? {}),
      },

      estateApartment: {
        ...EMPTY_APARTMENT,
        ...(temp.groups.estateApartment ?? {}),
      },

      estateHouse: {
        ...EMPTY_HOUSE,
        ...(temp.groups.estateHouse ?? {}),
      },

      multiselect: {
        ...EMPTY_MULTI,
        ...(temp.groups.multiselect ?? {}),
      },

      vicinity: {
        ...EMPTY_VICINITY,
        ...(temp.groups.vicinity ?? {}),
      },

      estateType: temp.estateType ?? null,
    };
    return result;
  }, [params]); // ← Only depends on params!

  useEffect(() => {
    async function load() {
      setLoading(true);

      const payload = normalizeQueryParams();

      const data = await searchEstate(payload);
      setProperties(data);

      setLoading(false);
    }

    load();
  }, [normalizeQueryParams]);

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
    router.replace(`/search/results?${newParams.toString()}`);
  }

  return (
    <div className="flex justify-center px-2 py-6">
      <div className="w-full max-w-7xl">
        <ConfigureFilters queryString={params.toString()} />
        <h1 className="text-brand-10 mb-6 text-3xl font-semibold">
          Search Results
        </h1>

        {loading ? (
          <p className="mb-8 text-gray-600">Loading...</p>
        ) : (
          <p className="mb-8 text-gray-600">
            {totalItems} {totalItems === 1 ? "property" : "properties"} found
          </p>
        )}

        {/* When empty */}
        {!loading && totalItems === 0 && (
          <div className="py-10 text-center text-lg text-gray-500">
            No results match your filters.
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
