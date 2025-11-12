"use client";
import { useSearchParams } from "next/navigation";
import ConfigureFilters from "./components/ConfigureFilters";
import PropertyPreviewCard from "@/components/Elements/PropertyPreviewCard";

const properties = [
  {
    id: 1,
    property_type: "apartment",
    floor_plan: "2+kk",
    usable_area: 48,
    offer_type: "lease",
    price: 18500,
    address: "Korunni 32, Praha 2",
  },
  {
    id: 2,
    property_type: "apartment",
    floor_plan: "3+1",
    usable_area: 76,
    offer_type: "sale",
    price: 6200000,
    address: "Lidycha 19, Brno",
  },
  {
    id: 3,
    property_type: "house",
    house_size: "4 rooms",
    usable_area: 120,
    offer_type: "lease",
    price: 35000,
    address: "Na Vysluni 8, Plzen",
  },
  {
    id: 4,
    property_type: "apartment",
    floor_plan: "3+kk",
    usable_area: 69,
    offer_type: "sale",
    price: 5700000,
    address: "Masarykova 15, Olomouc",
  },
  {
    id: 5,
    property_type: "house",
    house_size: "5 rooms",
    usable_area: 155,
    offer_type: "sale",
    price: 8900000,
    address: "U Lip 7, Chese Budeyovice",
  },
  {
    id: 6,
    property_type: "apartment",
    floor_plan: "2+1",
    usable_area: 54,
    offer_type: "lease",
    price: 19000,
    address: "Dluga 11, Hradec Kralove",
  },
  {
    id: 7,
    property_type: "apartment",
    floor_plan: "3+1",
    usable_area: 82,
    offer_type: "sale",
    price: 6950000,
    address: "Revolutsina 3, Praha 1",
  },
  {
    id: 8,
    property_type: "house",
    house_size: "3 rooms",
    usable_area: 95,
    offer_type: "lease",
    price: 28000,
    address: "Kvitinova 22, Liberec",
  },
  {
    id: 9,
    property_type: "apartment",
    floor_plan: "2+kk",
    usable_area: 45,
    offer_type: "sale",
    price: 4800000,
    address: "Tyrsova 10, Ostrava",
  },
  {
    id: 10,
    property_type: "house",
    house_size: "6 rooms",
    usable_area: 180,
    offer_type: "lease",
    price: 48000,
    address: "Yabloneva 5, Zlin",
  },
];

function Page() {
  const params = useSearchParams();
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
          <ConfigureFilters queryString={params.toString()} />

          <h1 className="text-brand-10 mb-2 text-2xl font-semibold md:text-3xl">
            {headline || "All properties"}
          </h1>

          <p className="mb-8 text-gray-600">
            {properties.length}{" "}
            {properties.length === 1 ? "property" : "properties"} found
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyPreviewCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
