import Link from "next/link";
import { GiSettingsKnobs } from "react-icons/gi";
import { useSearchParams } from "next/navigation";

function ConfigureFilters({ queryString }: Readonly<{ queryString: string }>) {
  const params = useSearchParams();

  const regions = params.getAll("region");
  const location =
    regions.length === 0
      ? "Any"
      : regions.length === 1
        ? regions[0]
        : `${regions.length} regions`;

  const offerTypeParam = params.get("offer_type");
  const offerType =
    offerTypeParam === "sale"
      ? "Sale"
      : offerTypeParam === "lease"
        ? "Lease"
        : "Any";

  const propertyTypeParam = params.get("property_type");
  const propertyType =
    propertyTypeParam === "apartment"
      ? "Apartment"
      : propertyTypeParam === "house"
        ? "House"
        : "Any";

  const price = "Unlimited";

  return (
    <Link href={`/search?${queryString}`}>
      <div className="shadow-brand-10/30 mb-6 flex items-center justify-center gap-6 rounded-full bg-white px-6 py-3 shadow-md sm:justify-between">
        <div className="hidden flex-1 items-center justify-around gap-6 sm:flex">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Location</span>
            <span className="font-semibold">{location}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Offer type</span>
            <span className="font-semibold">{offerType}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Property type</span>
            <span className="font-semibold">{propertyType}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Price</span>
            <span className="font-semibold">{price}</span>
          </div>
        </div>

        <div className="flex items-center sm:gap-2 sm:border-l sm:border-gray-200 sm:pl-6">
          <GiSettingsKnobs className="text-brand-6 rotate-90 text-xl" />
          <span className="text-brand-6 font-medium whitespace-nowrap">
            Edit search
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ConfigureFilters;
