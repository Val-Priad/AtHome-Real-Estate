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

export const operationTypeEnum = pgEnum("OPERATION_TYPE_ENUM", [
  "Sale",
  "Lease",
]);
export const currencyEnum = pgEnum("CURRENCY_ENUM", ["USD", "EUR"]);
export const priceUnitEnum = pgEnum("PRICE_UNIT_ENUM", [
  "per_property",
  "per_month",
  "per_night",
  "per_m2",
  "per_m2_per_month",
  "per_m2_per_day",
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
  "General practitioner",
  "Veterinarian",
  "Primary school",
  "Kindergarten",
  "Supermarket",
  "Small shop",
  "Restaurant / Pub",
  "Children's playground",
  "Metro",
]);
export const userRoleEnum = pgEnum("USER_ROLE_ENUM", [
  "admin",
  "agent",
  "user",
]);
export const mediaTypeEnum = pgEnum("MEDIA_TYPE_ENUM", [
  "image",
  "video",
  "pdf",
  "photo_360",
  "document",
  "floor plan",
]);
export const advertSubtypeEnum = pgEnum("ADVERT_SUBTYPE_ENUM", [
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
export const advertRoomCountEnum = pgEnum("ADVERT_ROOM_COUNT_ENUM", [
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
  }),
  operationType: operationTypeEnum("operation_type").notNull(),
  category: estateCategoryEnum("category").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  priceUnit: priceUnitEnum("price_unit").notNull(),
  city: text("city").notNull(),
  street: text("street").notNull(),
  regionCode: text("region_code").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  buildingCondition: buildingConditionEnum("building_condition").notNull(),
  usableArea: integer("usable_area"),
  totalFloorArea: integer("total_floor_area"),
  readyDate: date("ready_date"),
  costOfLiving: numeric("cost_of_living", { precision: 10, scale: 2 }),
  commission: numeric("commission", { precision: 10, scale: 2 }),
  refundableDeposit: numeric("refundable_deposit", { precision: 10, scale: 2 }),
  commissionPaidByOwner: boolean("commission_paid_by_owner").default(false),
  advertLifetime: integer("advert_lifetime").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  roadType: roadTypeEnum("road_type").notNull(),
  furnished: furnishedEnum("furnished").notNull(),
  easyAccess: boolean("easy_access").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================
// APARTMENT
// ==========================

export const estateApartment = pgTable("estate_apartment", {
  estateId: integer("estate_id")
    .primaryKey()
    .references(() => estate.id, { onDelete: "cascade" }),
  balcony: boolean("balcony").notNull().default(false),
  loggia: boolean("loggia").notNull().default(false),
  terrace: boolean("terrace").notNull().default(false),
  floorNumber: integer("floor_number"),
  apartmentNumber: text("apartment_number"),
  balconyArea: integer("balcony_area"),
  loggiaArea: integer("loggia_area"),
  terraceArea: integer("terrace_area"),
  flatClass: flatClassEnum("flat_class"),
  buildingType: buildingTypeEnum("building_type"),
  advertSubtype: advertSubtypeEnum("advert_subtype"),
});

// ==========================
// HOUSE
// ==========================

export const estateHouse = pgTable("estate_house", {
  estateId: integer("estate_id")
    .primaryKey()
    .references(() => estate.id, { onDelete: "cascade" }),
  pool: boolean("pool").notNull().default(false),
  floors: integer("floors"),
  gardenArea: integer("garden_area"),
  buildingArea: integer("building_area"),
  cellar: boolean("cellar").notNull().default(false),
  garage: boolean("garage").notNull().default(false),
  parkingLotsCount: integer("parking_lots_count"),
  undergroundFloors: integer("underground_floors"),
  acceptanceYear: integer("acceptance_year"),
  reconstructionYear: integer("reconstruction_year"),
  pvPanels: boolean("pv_panels").notNull().default(false),
  solarWaterHeating: boolean("solar_water_heating").notNull().default(false),
  roomCount: advertRoomCountEnum("room_count"),
  circuitBreaker: circuitBreakerEnum("circuit_breaker"),
  phase: phaseEnum("phase"),
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
    langCode: text("lang_code").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
  },
  (table) => [primaryKey({ columns: [table.estateId, table.langCode] })],
);

// ==========================
// MEDIA
// ==========================

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
