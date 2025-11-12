export interface CheckboxOption {
  value: string;
  label?: string;
}

// MULTI CHOICE
export const FLOOR_PLAN = "Floor Plan";
export const FEATURES_IN_THE_VICINITY = "Near the Apartments";
export const CONDITION = "Condition";
export const ACCESSORIES = "Accessories";
export const ENERGY_CLASS = "Energy Class";
export const OFFER_TYPE = "Offer Type";
export const HOUSE_CATEGORY = "House Category";
export const HOUSE_SIZE = "House Size";
export const BUILDING_MATERIAL = "Building Material";
export const REGION = "Region";

// SINGLE CHOICE
export const DISTANCE_TO_FACILITIES = "Distance to Facilities";
export const SMART_SEARCH = "Smart Search";

export const ARRAY_FIELDS: string[] = [
  FLOOR_PLAN,
  FEATURES_IN_THE_VICINITY,
  CONDITION,
  ACCESSORIES,
  ENERGY_CLASS,
  OFFER_TYPE,
  HOUSE_CATEGORY,
  HOUSE_SIZE,
  BUILDING_MATERIAL,
  REGION,
];

// ==========================
// OFFER TYPE OPTIONS
// ==========================
export const OFFER_TYPE_OPTIONS = [
  { value: "Sale", label: "Sale" },
  { value: "Lease", label: "Lease" },
];

// ==========================
// REGION OPTIONS
// ==========================
// Example: region codes from UA; can be replaced with actual region names
export const REGION_OPTIONS = [
  { value: "UA-05", label: "Vinnytsia" },
  { value: "UA-07", label: "Volyn" },
  { value: "UA-12", label: "Dnipropetrovsk" },
  { value: "UA-14", label: "Donetsk" },
  { value: "UA-18", label: "Zhytomyr" },
  { value: "UA-21", label: "Zakarpattia" },
  { value: "UA-23", label: "Zaporizhzhia" },
  { value: "UA-26", label: "Ivano-Frankivsk" },
  { value: "UA-32", label: "Kyiv Region" },
  { value: "UA-35", label: "Kirovohrad" },
  { value: "UA-46", label: "Lviv" },
  { value: "UA-48", label: "Mykolaiv" },
  { value: "UA-51", label: "Odesa" },
  { value: "UA-53", label: "Poltava" },
  { value: "UA-56", label: "Rivne" },
  { value: "UA-59", label: "Sumy" },
  { value: "UA-61", label: "Ternopil" },
  { value: "UA-63", label: "Kharkiv" },
  { value: "UA-65", label: "Kherson" },
  { value: "UA-68", label: "Khmelnytskyi" },
  { value: "UA-71", label: "Cherkasy" },
  { value: "UA-74", label: "Chernihiv" },
  { value: "UA-77", label: "Chernivtsi" },
  { value: "UA-43", label: "Crimea" },
  { value: "UA-30", label: "Kyiv City" },
  { value: "UA-40", label: "Sevastopol" },
];

// ==========================
// VICINITY OPTIONS
// ==========================
export const VICINITY_OPTIONS = [
  { value: "0.5", label: "Up to a distance of 0.5 km" },
  { value: "1", label: "Up to a distance of 1 km" },
  { value: "1.5", label: "Up to a distance of 1.5 km" },
  { value: "2", label: "Up to a distance of 2 km" },
  { value: "5", label: "Up to a distance of 5 km" },
  { value: "10", label: "Up to a distance of 10 km" },
];

// ==========================
// VICINITY FEATURE OPTIONS
// ==========================
export const VICINITY_FEATURE_OPTIONS = [
  { value: "Bus stop", label: "Bus stop" },
  { value: "Train station", label: "Train station" },
  { value: "Post office", label: "Post office" },
  { value: "ATM", label: "ATM" },
  { value: "Clinic", label: "Clinic" },
  { value: "Veterinarian", label: "Veterinarian" },
  { value: "School", label: "School" },
  { value: "Kindergarten", label: "Kindergarten" },
  { value: "Supermarket", label: "Supermarket" },
  { value: "Small shop", label: "Small shop" },
  { value: "Restaurant, Pub", label: "Restaurant, Pub" },
  { value: "Children's playground", label: "Children's playground" },
  { value: "Metro", label: "Metro" },
];

// ==========================
// CONDITION OPTIONS
// ==========================
export const CONDITION_OPTIONS = [
  { value: "Very good", label: "Very good" },
  { value: "Good", label: "Good" },
  { value: "Poor", label: "Poor" },
  { value: "Under construction", label: "Under construction" },
  { value: "Project", label: "Project" },
  { value: "New building", label: "New building" },
  { value: "For demolition", label: "For demolition" },
  { value: "Before reconstruction", label: "Before reconstruction" },
  { value: "After reconstruction", label: "After reconstruction" },
  { value: "Under reconstruction", label: "Under reconstruction" },
];

// ==========================
// ENERGY CLASS OPTIONS
// ==========================
export const ENERGY_CLASS_OPTIONS = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
  { value: "F", label: "F" },
  { value: "G", label: "G" },
];

// ==========================
// FLOOR PLAN OPTIONS
// ==========================
export const FLOOR_PLAN_OPTIONS = [
  { value: "1 studio", label: "1 studio" },
  { value: "1+1", label: "1+1" },
  { value: "2 studio", label: "2 studio" },
  { value: "2+1", label: "2+1" },
  { value: "3 studio", label: "3 studio" },
  { value: "3+1", label: "3+1" },
  { value: "4 studio", label: "4 studio" },
  { value: "4+1", label: "4+1" },
  { value: "5 studio", label: "5 studio" },
  { value: "5+1", label: "5+1" },
  { value: "6 or more", label: "6 or more" },
  { value: "Atypical", label: "Atypical" },
  { value: "Room", label: "Room" },
];

// ==========================
// BUILDING MATERIAL OPTIONS
// ==========================
export const BUILDING_MATERIAL_OPTIONS = [
  { value: "Panel", label: "Panel" },
  { value: "Brick", label: "Brick" },
  { value: "Other", label: "Other" },
];

// ==========================
// APARTMENT ACCESSORY OPTIONS
// ==========================
export const APARTMENT_ACCESSORY_OPTIONS = [
  { value: "balcony", label: "Balcony" },
  { value: "loggia", label: "Loggia" },
  { value: "garden", label: "Garden" },
  { value: "terrace", label: "Terrace" },
  { value: "parking", label: "Parking" },
  { value: "elevator", label: "Elevator" },
  { value: "barrierFree", label: "Barrier-free" },
];

export const HOUSE_ACCESSORY_OPTIONS = [
  { value: "parkingLots", label: "Parking Lots" },
  { value: "pool", label: "Pool" },
  { value: "cellar", label: "Cellar" },
  { value: "garage", label: "Garage" },
  { value: "pvPanels", label: "PV Panels" },
  { value: "solarWaterHeating", label: "Solar Water Heating" },
];

// ==========================
// HOUSE CATEGORY OPTIONS
// ==========================
export const HOUSE_CATEGORY_OPTIONS: CheckboxOption[] = [
  { value: "Cottage", label: "Cottage" },
  { value: "Monument/Other", label: "Monument/Other" },
  { value: "Family house", label: "Family house" },
  { value: "Villa", label: "Villa" },
  { value: "Turnkey", label: "Turnkey" },
  { value: "Country house", label: "Country house" },
  { value: "Farmstead", label: "Farmstead" },
  { value: "Multi-generational house", label: "Multi-generational house" },
];

// ==========================
// HOUSE SIZE OPTIONS
// ==========================
export const HOUSE_SIZE_OPTIONS = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export const HOUSE_TYPE_OPTIONS: CheckboxOption[] = [
  { value: "Detached", label: "Detached" },
  { value: "Semi-detached", label: "Semi-detached" },
  { value: "Terraced", label: "Terraced" },
];
