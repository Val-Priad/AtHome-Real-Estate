import type { EstateData } from "@/lib/actions/estate/getEstateById";

export function generateEstateSubTitle(data: NonNullable<EstateData>) {
  const estate = data.estate;
  const apartment = data.apartment;
  const house = data.house;

  // OPERATION TYPE
  const operation =
    estate.operationType === "Sale"
      ? "Apartment for sale"
      : estate.operationType === "Lease"
        ? "Apartment for rent"
        : "Estate";

  // CATEGORY PART
  let categoryPart = "";
  if (estate.category === "Apartment" && apartment) {
    categoryPart = apartment.apartmentPlan ?? "";
  }

  if (estate.category === "House" && house) {
    categoryPart = house.roomCount ?? "";
  }

  // AREA
  const areaPart = estate.usableArea ? `${estate.usableArea} m²` : "";

  // LOCATION
  const street = estate.street;
  const city = estate.city;
  const region = estate.region ? `- ${estate.region}` : "";

  return [
    operation,
    categoryPart && categoryPart,
    areaPart && `, ${areaPart}`,
    street && street + ",",
    city,
    region,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+,/g, ",");
}
