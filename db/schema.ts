import {
  pgEnum,
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  boolean,
  numeric,
  doublePrecision,
  primaryKey,
  date,
} from "drizzle-orm/pg-core";

// ==========================
// ENUMS
// ==========================

export const regionEnum = pgEnum("REGION_CODE_ENUM", [
  "Vinnytsia Region", // UA-05
  "Volyn Region", // UA-07
  "Dnipropetrovsk Region", // UA-12
  "Donetsk Region", // UA-14
  "Zhytomyr Region", // UA-18
  "Zakarpattia Region", // UA-21
  "Zaporizhzhia Region", // UA-23
  "Ivano-Frankivsk Region", // UA-26
  "Kyiv Region", // UA-32
  "Kirovohrad Region", // UA-35
  "Lviv Region", // UA-46
  "Mykolaiv Region", // UA-48
  "Odesa Region", // UA-51
  "Poltava Region", // UA-53
  "Rivne Region", // UA-56
  "Sumy Region", // UA-59
  "Ternopil Region", // UA-61
  "Kharkiv Region", // UA-63
  "Kherson Region", // UA-65
  "Khmelnytskyi Region", // UA-68
  "Cherkasy Region", // UA-71
  "Chernihiv Region", // UA-74
  "Chernivtsi Region", // UA-77
  "Autonomous Republic of Crimea", // UA-43 (Autonomous Republic)
  "Kyiv City", // UA-30 (City with Special Status)
  "Sevastopol City", // UA-40 (City with Special Status)
]);

export const energyClassEnum = pgEnum("ENERGY_CLASS_ENUM", [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
]);

export const operationTypeEnum = pgEnum("OPERATION_TYPE_ENUM", [
  "Sale",
  "Lease",
]);

export const currencyEnum = pgEnum("CURRENCY_ENUM", ["USD", "EUR"]);

export const priceUnitEnum = pgEnum("PRICE_UNIT_ENUM", [
  "per property",
  "per month",
  "per night",
  "per m2",
  "per m2 per month",
  "per m2 per day",
]);

export const estateCategoryEnum = pgEnum("ESTATE_CATEGORY_ENUM", [
  "Apartment",
  "House",
]);

export const buildingConditionEnum = pgEnum("BUILDING_CONDITION_ENUM", [
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

export const buildingTypeEnum = pgEnum("BUILDING_TYPE_ENUM", [
  "Panel",
  "Brick",
  "Other",
]);

export const vicinityTypeEnum = pgEnum("VICINITY_TYPE_ENUM", [
  "Bus stop",
  "Train station",
  "Post office",
  "ATM",
  "Clinic",
  "Veterinarian",
  "School",
  "Kindergarten",
  "Supermarket",
  "Small shop",
  "Restaurant / Pub",
  "Children's playground",
  "Metro",
  "Closest",
]);

export const userRoleEnum = pgEnum("USER_ROLE_ENUM", [
  "admin",
  "agent",
  "user",
]);

export const mediaTypeEnum = pgEnum("MEDIA_TYPE_ENUM", ["image", "video"]);

export const apartmentPlanEnum = pgEnum("ADVERT_SUBTYPE_ENUM", [
  "1 studio",
  "1+1",
  "2 studio",
  "2+1",
  "3 studio",
  "3+1",
  "4 studio",
  "4+1",
  "5 studio",
  "5+1",
  "6 or more",
  "Atypical",
  "Room",
]);

export const roomCountEnum = pgEnum("ADVERT_ROOM_COUNT_ENUM", [
  "1",
  "2",
  "3",
  "4",
  "5+",
  "Atypical",
]);

export const flatClassEnum = pgEnum("FLAT_CLASS_ENUM", [
  "Maisonette",
  "Loft",
  "Attic",
  "Single-story",
]);

export const houseCategoryEnum = pgEnum("HOUSE_CATEGORY_ENUM", [
  "Cottage",
  "Monument/Other",
  "Family house",
  "Villa",
  "Turnkey",
  "Country house",
  "Farmstead",
  "Multi-generational house",
]);

export const houseTypeEnum = pgEnum("HOUSE_TYPE_ENUM", [
  "Detached",
  "Semi-detached",
  "Terraced",
]);

export const waterHeatSourceEnum = pgEnum("WATER_HEAT_SOURCE_ENUM", [
  "Electric boiler",
  "Gas boiler",
  "Flow heater",
  "Solar collector",
  "Other",
]);

export const heatingSourceEnum = pgEnum("HEATING_SOURCE_ENUM", [
  "Gas boiler",
  "Electric boiler",
  "Central heating",
  "Fireplace",
  "Heat pump",
  "Other",
]);

export const heatingElementEnum = pgEnum("HEATING_ELEMENT_ENUM", [
  "Radiator",
  "Underfloor heating",
  "Stove with water circuit",
  "Heat pump",
  "Other",
]);

export const waterEnum = pgEnum("WATER_ENUM", [
  "Hot water",
  "Cold water",
  "Well",
  "Other",
]);

export const electricityEnum = pgEnum("ELECTRICITY_ENUM", [
  "120V",
  "220V",
  "230V",
  "380V",
  "400V",
  "Other",
]);

export const roadTypeEnum = pgEnum("ROAD_TYPE_ENUM", [
  "Asphalt",
  "Gravel",
  "No access road",
]);

export const telecommunicationEnum = pgEnum("TELECOMMUNICATION_ENUM", [
  "Telephone",
  "Internet",
  "Satellite",
]);

export const furnishedEnum = pgEnum("FURNISHED_ENUM", [
  "Yes",
  "No",
  "Partially",
]);

export const internetConnectionEnum = pgEnum("INTERNET_CONNECTION_ENUM", [
  "None",
  "Fiber",
  "DSL",
  "Cable",
  "Satellite",
  "Mobile 4G",
  "Mobile 5G",
  "Other",
]);

export const phaseEnum = pgEnum("PHASE_ENUM", ["Single-phase", "Three-phase"]);

export const circuitBreakerEnum = pgEnum("CIRCUIT_BREAKER_ENUM", [
  "20A",
  "25A",
  "32A",
  "Other",
]);

// ==========================
// USERS / BROKERS
// ==========================

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  role: userRoleEnum("role").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  description: text("description"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userAuth = pgTable("user_auth", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => profile.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================
// ESTATE
// ==========================

export const estate = pgTable("estate", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").references(() => profile.id, {
    onDelete: "set null",
  }), // TODO search field for owner, could be null if owner is not registered
  brokerId: integer("broker_id").references(() => profile.id, {
    onDelete: "set null",
  }), // TODO dropdown list of brokers is generated from profile with role 'agent'

  category: estateCategoryEnum("category").notNull(), // dropdown
  operationType: operationTypeEnum("operation_type").notNull(), // dropdown
  buildingCondition: buildingConditionEnum("building_condition").notNull(), // dropdown
  energyClass: energyClassEnum("energy_class").notNull(), // dropdown
  usableArea: doublePrecision("usable_area"), // input field
  totalFloorArea: doublePrecision("total_floor_area"), // input field
  roadType: roadTypeEnum("road_type").notNull(), // dropdown
  furnished: furnishedEnum("furnished").notNull(), //  dropdown
  easyAccess: boolean("easy_access").notNull().default(false), // checkbox
  readyDate: date("ready_date").notNull(), // date picker
  advertLifetime: integer("advert_lifetime").notNull(), //  dropdown in days (7, 30, 90, 180, 365)
  expiresAt: timestamp("expires_at").notNull(), // TODO automatically calculated not in ui

  price: numeric("price", { precision: 10, scale: 2 }).notNull(), // input field
  currency: currencyEnum("currency").notNull(), // dropdown
  priceUnit: priceUnitEnum("price_unit").notNull(), // dropdown
  costOfLiving: numeric("cost_of_living", { precision: 10, scale: 2 }), //  input field
  commission: numeric("commission", { precision: 10, scale: 2 }), //  input field
  commissionPaidByOwner: boolean("commission_paid_by_owner").default(false), // checkbox
  refundableDeposit: numeric("refundable_deposit", { precision: 10, scale: 2 }), // input field

  city: text("city").notNull(), // input field
  street: text("street").notNull(), // input field
  region: regionEnum("region").notNull(), // dropdown
  latitude: doublePrecision("latitude").notNull(), //  input field
  longitude: doublePrecision("longitude").notNull(), //  input field

  createdAt: timestamp("created_at").defaultNow().notNull(), // TODO automatically set
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // TODO automatically set
});

// ==========================
// APARTMENT
// ==========================

export const estateApartment = pgTable("estate_apartment", {
  estateId: integer("estate_id")
    .primaryKey()
    .references(() => estate.id, { onDelete: "cascade" }),
  flatClass: flatClassEnum("flat_class"), // dropdown
  buildingType: buildingTypeEnum("building_type"), // dropdown
  apartmentPlan: apartmentPlanEnum("advert_subtype"), // dropdown

  floorNumber: integer("floor_number"), // input field
  apartmentNumber: text("apartment_number"), // input field

  garden: boolean("garden").notNull().default(false), //  checkbox
  parking: boolean("parking").notNull().default(false), //  checkbox
  elevator: boolean("elevator").notNull().default(false), //  checkbox

  balconyArea: integer("balcony_area"), //  input field
  loggiaArea: integer("loggia_area"), //  input field
  terraceArea: integer("terrace_area"), //  input field
});

// ==========================
// HOUSE
// ==========================

export const estateHouse = pgTable("estate_house", {
  estateId: integer("estate_id")
    .primaryKey()
    .references(() => estate.id, { onDelete: "cascade" }),
  houseCategory: houseCategoryEnum("house_category"), // dropdown
  roomCount: roomCountEnum("room_count"), // dropdown
  houseType: houseTypeEnum("house_type"), // dropdown
  reconstructionYear: integer("reconstruction_year"), // input field
  acceptanceYear: integer("acceptance_year"), // input field

  floors: integer("floors"), // input field
  undergroundFloors: integer("underground_floors"), // input field
  parkingLotsCount: integer("parking_lots_count"), // input field

  gardenArea: integer("garden_area"), // input field
  buildingArea: integer("building_area"), // input field

  circuitBreaker: circuitBreakerEnum("circuit_breaker"), // dropdown
  phase: phaseEnum("phase"), // dropdown

  pool: boolean("pool").notNull().default(false), //  checkbox
  cellar: boolean("cellar").notNull().default(false), //  checkbox
  garage: boolean("garage").notNull().default(false), //  checkbox
  pvPanels: boolean("pv_panels").notNull().default(false), //  checkbox
  solarWaterHeating: boolean("solar_water_heating").notNull().default(false), //  checkbox
});

// ==========================
// TRANSLATION
// ==========================

export const estateTranslation = pgTable(
  "estate_translation",
  {
    estateId: integer("estate_id").references(() => estate.id, {
      onDelete: "cascade",
    }),
    langCode: text("lang_code").notNull(), // automatically set on ui
    title: text("title").notNull(), // input field
    description: text("description").notNull(), // input field
  },
  (table) => [primaryKey({ columns: [table.estateId, table.langCode] })],
);

// ==========================
// MEDIA
// ==========================

// make only place for it with basic markup, actual media handling will be done later
export const estateMedia = pgTable("estate_media", {
  id: serial("id").primaryKey(),
  estateId: integer("estate_id")
    .notNull()
    .references(() => estate.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
  alt: text("alt"),
  isMain: boolean("is_main").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==========================
// WISH LIST
// ==========================

export const wishList = pgTable(
  "wish_list",
  {
    userId: integer("user_id").references(() => profile.id, {
      onDelete: "cascade",
    }),
    estateId: integer("estate_id").references(() => estate.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.estateId] })],
);

// ==========================
// VICINITY
// ==========================

// will be collected automatically by api, simply make a button to fetch vicinity data, make it near the latitude/longitude fields
export const estateVicinity = pgTable("estate_vicinity", {
  id: serial("id").primaryKey(),
  estateId: integer("estate_id")
    .notNull()
    .references(() => estate.id, { onDelete: "cascade" }),
  type: vicinityTypeEnum("type").notNull(),
  name: text("name").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  distanceM: integer("distance_m").notNull(),
});

// ==========================
// MULTISELECT LINK TABLES
// ==========================

// checkbox group
export const estateHeatingSource = pgTable(
  "estate_heating_source",
  {
    estateId: integer("estate_id")
      .notNull()
      .references(() => estate.id, { onDelete: "cascade" }),
    heatingSource: heatingSourceEnum("heating_source").notNull(),
  },
  (table) => [primaryKey({ columns: [table.estateId, table.heatingSource] })],
);

// checkbox group
export const estateHeatingElement = pgTable(
  "estate_heating_element",
  {
    estateId: integer("estate_id")
      .notNull()
      .references(() => estate.id, { onDelete: "cascade" }),
    heatingElement: heatingElementEnum("heating_element").notNull(),
  },
  (table) => [primaryKey({ columns: [table.estateId, table.heatingElement] })],
);

// checkbox group
export const estateWaterHeating = pgTable(
  "estate_water_heating",
  {
    estateId: integer("estate_id")
      .notNull()
      .references(() => estate.id, { onDelete: "cascade" }),
    waterHeatSource: waterHeatSourceEnum("water_heat_source").notNull(),
  },
  (table) => [primaryKey({ columns: [table.estateId, table.waterHeatSource] })],
);

// checkbox group
export const estateWater = pgTable(
  "estate_water",
  {
    estateId: integer("estate_id").references(() => estate.id, {
      onDelete: "cascade",
    }),
    water: waterEnum("water").notNull(),
  },
  (table) => [primaryKey({ columns: [table.estateId, table.water] })],
);

// checkbox group
export const estateElectricity = pgTable(
  "estate_electricity",
  {
    estateId: integer("estate_id").references(() => estate.id, {
      onDelete: "cascade",
    }),
    electricity: electricityEnum("electricity").notNull(),
  },
  (table) => [primaryKey({ columns: [table.estateId, table.electricity] })],
);

// checkbox group
export const estateTelecommunication = pgTable(
  "estate_telecommunication",
  {
    estateId: integer("estate_id").references(() => estate.id, {
      onDelete: "cascade",
    }),
    telecommunication: telecommunicationEnum("telecommunication").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.estateId, table.telecommunication] }),
  ],
);

// checkbox group
export const estateInternet = pgTable(
  "estate_internet",
  {
    estateId: integer("estate_id").references(() => estate.id, {
      onDelete: "cascade",
    }),
    connectionType: internetConnectionEnum("connection_type").notNull(),
  },
  (table) => [primaryKey({ columns: [table.estateId, table.connectionType] })],
);
