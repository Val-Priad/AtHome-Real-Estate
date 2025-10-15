export interface CheckboxOption {
  value: string;
  label?: string;
}

export const FLOOR_PLAN = "Floor Plan";
export const FEATURES_IN_THE_VICINITY = "Near the Apartments";
export const CONDITION = "Condition";
export const ACCESSORIES = "Accessories";
export const ENERGY_CLASS = "Energy Class";
export const OFFER_TYPE = "Offer Type";
export const HOUSE_CATEGORY = "House Category";
export const HOUSE_SIZE = "House Size";
export const BUILDING_MATERIAL = "Building Material";

export const ARRAY_FIELDS: string[] = [
  // APARTMENTS ARRAY FIELDS
  FLOOR_PLAN,
  FEATURES_IN_THE_VICINITY,
  CONDITION,
  ACCESSORIES,
  ENERGY_CLASS,
  OFFER_TYPE,
  HOUSE_CATEGORY,
  HOUSE_SIZE,
  BUILDING_MATERIAL,
];

export const CAMEL_ARRAY_FIELDS: string[] = ARRAY_FIELDS.map((value) =>
  toCamelCase(value),
);

// BOTH APARTMENTS AND HOUSES
export const OFFER_TYPE_OPTIONS = toOptions(["Sale", "Lease"]);

export const REGIONS_OPTIONS = [
  "Vinnytsya region",
  "Volyn region",
  "Luhans'k region",
  "Dnipropetrovs'k region",
  "Donets'k region",
  "Zhytomyr region",
  "Transcarpathia region",
  "Zaporizhzhya region",
  "Ivano-Frankivs'k region",
  "Kiev City",
  "Kiev region",
  "Kirovohrad region",
  "Sevastopol' City",
  "Crimea region",
  "L'viv region",
  "Mykolayiv region",
  "Odessa region",
  "Poltava region",
  "Rivne region",
  "Sumy region",
  "Ternopil' region",
  "Kharkiv region",
  "Kherson region",
  "Khmel'nyts'kyy region",
  "Cherkasy region",
  "Chernihiv region",
  "Chernivtsi region",
];

export const CONDITION_OPTIONS = toOptions([
  "Very good",
  "Good",
  "Poor",
  "Under construction",
  "Project",
  "New building",
  "For demolition",
  "Before reconstruction",
  "After reconstruction",
  "Under reconstruction",
]);

export const VICINITY_FEATURE_OPTIONS = toOptions([
  "Bus stop",
  "Train station",
  "Post office",
  "ATM",
  "General practitioner",
  "Veterinarian",
  "Primary school",
  "Kindergarten",
  "Supermarket",
  "Small shop",
  "Restaurant, pub",
  "Children's playground",
  "Metro",
]);

export const ENERGY_CLASS_OPTIONS: CheckboxOption[] = [
  { value: "A", label: "A - Extremely economical" },
  { value: "B", label: "B - Very economical" },
  { value: "C", label: "C - Economical" },
  { value: "D", label: "D - Less economical" },
  { value: "E", label: "E - Uneconomical" },
  { value: "F", label: "F - Very uneconomical" },
  { value: "G", label: "G - Extremely wasteful" },
];

// ALL RELATED TO APARTMENTS
export const FLOOR_PLAN_OPTIONS = toOptions([
  "1+kk",
  "1+1",
  "2+kk",
  "2+1",
  "3+kk",
  "3+1",
  "4+kk",
  "4+1",
  "5+kk",
  "5+1",
  "6 and more",
  "Atypical",
  "Room",
]);

export const BUILDING_MATERIAL_OPTIONS = toOptions(["Panel", "Break", "Other"]);

export const APARTMENT_ACCESSORY_OPTIONS = toOptions([
  "Balcony",
  "Loggia",
  "Garden",
  "Terrace",
  "Cellar",
  "Parking",
  "Garage",
  "Barrier-free",
  "Elevator",
]);

// ALL RELATED TO HOUSES
export const HOUSE_ACCESSORY_OPTIONS = toOptions([
  "Timber construction",
  "Ground floor",
  "Multi-story",
  "Detached",
  "Terraced/Block",
  "Parking",
  "Swimming pool",
  "Cellar",
  "Garage",
]);

export const HOUSE_CATEGORY_OPTIONS = toOptions([
  "Cottage",
  "Monument/Other",
  "Family house",
  "Villa",
  "Turnkey",
  "Country house",
  "Farmstead",
  "Multi-generational house",
]);

export const HOUSE_SIZE_OPTIONS = toOptions([
  "1 room",
  "2 rooms",
  "3 rooms",
  "4 rooms",
  "5 and more rooms",
  "Atypical",
]);

function toOptions(values: string[]): CheckboxOption[] {
  return values.map((value) => ({ value }));
}

export function toCamelCase(str: string) {
  if (!str || typeof str !== "string") {
    return "";
  }
  const trimmedStr = str.trim();

  return trimmedStr
    .split(" ")
    .map((word, index) => {
      if (!word) {
        return "";
      }

      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}
