import type { AdapterAccountType } from "@auth/core/adapters";

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

export const regionEnum = pgEnum("REGION_CODE_ENUM", [
  "Vinnytsia Region", // UA-05
  "Volyn Region", // UA-07
  "Luhansk Region", // UA-09
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

export type VicinityType = (typeof vicinityTypeEnum.enumValues)[number];

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
  "Water central heating",
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

export const estateStatusEnum = pgEnum("ESTATE_STATUS_ENUM", [
  "Active",
  "Expired",
  "Expiring",
  "Archived",
  "Suggested",
]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),

  passwordHash: text("password_hash").notNull(),
  phoneNumber: text("phone_number"),
  description: text("description"),
  role: userRoleEnum("role").notNull().default("user"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),

    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ],
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credential_id").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("provider_account_id").notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credential_device_type").notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  ],
);

export const emailVerifications = pgTable("email_verification", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const estate = pgTable("estate", {
  id: serial("id").primaryKey(),
  sellerId: text("seller_id").references(() => users.id, {
    onDelete: "set null",
  }),
  brokerId: text("broker_id").references(() => users.id, {
    onDelete: "set null",
  }),

  category: estateCategoryEnum("category").notNull(),
  operationType: operationTypeEnum("operation_type").notNull(),
  buildingCondition: buildingConditionEnum("building_condition").notNull(),
  energyClass: energyClassEnum("energy_class").notNull(),
  usableArea: doublePrecision("usable_area"),
  totalFloorArea: doublePrecision("total_floor_area"),
  roadType: roadTypeEnum("road_type").notNull(),
  furnished: furnishedEnum("furnished").notNull(),
  easyAccess: boolean("easy_access").notNull().default(false),
  readyDate: date("ready_date").notNull(),
  advertLifetime: integer("advert_lifetime").notNull(),
  expiresAt: timestamp("expires_at").notNull(),

  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  priceUnit: priceUnitEnum("price_unit").notNull(),
  costOfLiving: numeric("cost_of_living", { precision: 10, scale: 2 }),
  commission: numeric("commission", { precision: 10, scale: 2 }),
  commissionPaidByOwner: boolean("commission_paid_by_owner").default(false),
  refundableDeposit: numeric("refundable_deposit", { precision: 10, scale: 2 }),

  city: text("city").notNull(),
  street: text("street").notNull(),
  region: regionEnum("region").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: estateStatusEnum("status").default("Active"),
});

export const estateApartment = pgTable("estate_apartment", {
  estateId: integer("estate_id")
    .primaryKey()
    .references(() => estate.id, { onDelete: "cascade" }),
  flatClass: flatClassEnum("flat_class"),
  buildingType: buildingTypeEnum("building_type"),
  apartmentPlan: apartmentPlanEnum("advert_subtype"),

  floorNumber: integer("floor_number"),
  apartmentNumber: text("apartment_number"),

  garden: boolean("garden").notNull().default(false),
  parking: boolean("parking").notNull().default(false),
  elevator: boolean("elevator").notNull().default(false),

  balconyArea: integer("balcony_area"),
  loggiaArea: integer("loggia_area"),
  terraceArea: integer("terrace_area"),
});

export const estateHouse = pgTable("estate_house", {
  estateId: integer("estate_id")
    .primaryKey()
    .references(() => estate.id, { onDelete: "cascade" }),
  houseCategory: houseCategoryEnum("house_category"),
  roomCount: roomCountEnum("room_count"),
  houseType: houseTypeEnum("house_type"),
  reconstructionYear: integer("reconstruction_year"),
  acceptanceYear: integer("acceptance_year"),

  floors: integer("floors"),
  undergroundFloors: integer("underground_floors"),
  parkingLotsCount: integer("parking_lots_count"),

  gardenArea: integer("garden_area"),
  buildingArea: integer("building_area"),

  circuitBreaker: circuitBreakerEnum("circuit_breaker"),
  phase: phaseEnum("phase"),

  pool: boolean("pool").notNull().default(false),
  cellar: boolean("cellar").notNull().default(false),
  garage: boolean("garage").notNull().default(false),
  pvPanels: boolean("pv_panels").notNull().default(false),
  solarWaterHeating: boolean("solar_water_heating").notNull().default(false),
});

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

export const savedEstate = pgTable(
  "saved_estate",
  {
    userId: text("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    estateId: integer("estate_id").references(() => estate.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.estateId] })],
);

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
