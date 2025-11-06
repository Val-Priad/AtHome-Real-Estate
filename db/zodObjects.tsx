import { z } from "zod";
import {
  estateCategoryEnum,
  operationTypeEnum,
  buildingConditionEnum,
  energyClassEnum,
  roadTypeEnum,
  furnishedEnum,
  currencyEnum,
  priceUnitEnum,
  regionEnum,
  houseCategoryEnum,
  houseTypeEnum,
  phaseEnum,
  circuitBreakerEnum,
  flatClassEnum,
  buildingTypeEnum,
  heatingSourceEnum,
  heatingElementEnum,
  waterHeatSourceEnum,
  waterEnum,
  electricityEnum,
  telecommunicationEnum,
  internetConnectionEnum,
  mediaTypeEnum,
  roomCountEnum,
  apartmentPlanEnum,
  vicinityTypeEnum,
} from "@/db/schema";

export const estateSchema = z.object({
  sellerId: z.coerce.number().optional(),
  brokerId: z.coerce.number().optional(),

  category: z.enum(estateCategoryEnum.enumValues, { error: "Required" }),
  operationType: z.enum(operationTypeEnum.enumValues, { error: "Required" }),
  buildingCondition: z.enum(buildingConditionEnum.enumValues, {
    error: "Required",
  }),
  energyClass: z.enum(energyClassEnum.enumValues, { error: "Required" }),
  roadType: z.enum(roadTypeEnum.enumValues, { error: "Required" }),
  furnished: z.enum(furnishedEnum.enumValues, { error: "Required" }),
  currency: z.enum(currencyEnum.enumValues, { error: "Required" }),
  priceUnit: z.enum(priceUnitEnum.enumValues, { error: "Required" }),
  region: z.enum(regionEnum.enumValues, { error: "Required" }),

  usableArea: z.coerce.number().positive("Must be positive").optional(),
  totalFloorArea: z.coerce.number().positive("Must be positive").optional(),
  price: z.coerce.number().positive("Must be positive"),
  costOfLiving: z.coerce
    .number()
    .nonnegative("Must be not negative")
    .optional(),
  commission: z.coerce.number().positive("Must be positive").optional(),
  refundableDeposit: z.coerce
    .number()
    .nonnegative("Must be not negative")
    .optional(),

  easyAccess: z.boolean().default(false),
  commissionPaidByOwner: z.boolean().default(false),

  readyDate: z.coerce.date(),
  advertLifetime: z.coerce
    .number()
    .int()
    .positive()
    .refine((val) => [7, 30, 90, 180, 365].includes(val), {
      message: "Invalid advert lifetime",
    }),

  city: z.string().trim().min(1, "Required").max(255),
  street: z.string().trim().min(1, "Required").max(255),

  latitude: z.coerce
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),
  longitude: z.coerce
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),
});

export const estateHouseSchema = z.object({
  houseCategory: z.enum(houseCategoryEnum.enumValues).optional().nullable(),
  roomCount: z.enum(roomCountEnum.enumValues).optional().nullable(),
  houseType: z.enum(houseTypeEnum.enumValues).optional().nullable(),
  circuitBreaker: z.enum(circuitBreakerEnum.enumValues).optional().nullable(),
  phase: z.enum(phaseEnum.enumValues).optional().nullable(),

  reconstructionYear: z.coerce
    .number()
    .int("Must be an integer")
    .min(1000, "Invalid year")
    .max(new Date().getFullYear(), "Cannot be in the future")
    .optional()
    .nullable(),
  acceptanceYear: z.coerce
    .number()
    .int("Must be an integer")
    .min(1000, "Invalid year")
    .max(new Date().getFullYear(), "Cannot be in the future")
    .optional()
    .nullable(),
  floors: z.coerce.number().int().nonnegative().optional().nullable(),
  undergroundFloors: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional()
    .nullable(),
  parkingLotsCount: z.coerce.number().int().nonnegative().optional().nullable(),
  gardenArea: z.coerce.number().int().nonnegative().optional().nullable(),
  buildingArea: z.coerce.number().int().nonnegative().optional().nullable(),

  pool: z.boolean().default(false),
  cellar: z.boolean().default(false),
  garage: z.boolean().default(false),
  pvPanels: z.boolean().default(false),
  solarWaterHeating: z.boolean().default(false),
});

export const estateApartmentSchema = z.object({
  flatClass: z.enum(flatClassEnum.enumValues).optional().nullable(),
  buildingType: z.enum(buildingTypeEnum.enumValues).optional().nullable(),
  apartmentPlan: z.enum(apartmentPlanEnum.enumValues).optional().nullable(),

  floorNumber: z.coerce.number().int().nonnegative().optional().nullable(),
  balconyArea: z.coerce.number().int().nonnegative().optional().nullable(),
  loggiaArea: z.coerce.number().int().nonnegative().optional().nullable(),
  terraceArea: z.coerce.number().int().nonnegative().optional().nullable(),

  apartmentNumber: z.string().trim().max(255, "Too long").optional().nullable(),

  garden: z.boolean().default(false),
  parking: z.boolean().default(false),
  elevator: z.boolean().default(false),
});

export const estateMultiSelectSchema = z.object({
  estateHeatingSource: z.array(z.enum(heatingSourceEnum.enumValues)).optional(),
  estateHeatingElement: z
    .array(z.enum(heatingElementEnum.enumValues))
    .optional(),
  estateWaterHeatSource: z
    .array(z.enum(waterHeatSourceEnum.enumValues))
    .optional(),
  estateWater: z.array(z.enum(waterEnum.enumValues)).optional(),
  estateElectricity: z.array(z.enum(electricityEnum.enumValues)).optional(),
  estateTelecommunication: z
    .array(z.enum(telecommunicationEnum.enumValues))
    .optional(),
  estateInternetConnections: z
    .array(z.enum(internetConnectionEnum.enumValues))
    .optional(),
});

const textField = z.string().trim().min(1, "Required").max(255, "Too long");

const descriptionTextField = z
  .string()
  .trim()
  .min(1, "Required")
  .max(10000, "Too long");

const translationSchema = z.object({
  description: z.object({ ua: descriptionTextField, en: descriptionTextField }),
  title: z.object({ ua: textField, en: textField }),
});

const mediaSchema = z
  .array(
    z.object({
      url: z.url(),
      type: z.enum(mediaTypeEnum.enumValues),
      alt: z.string().max(255).optional().nullable(),
      isMain: z.boolean().default(false),
    }),
  )
  .min(1, "At least one media item is required");

export const vicinityItemSchema = z.object({
  type: z.enum(vicinityTypeEnum.enumValues),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  id: z.number(),
  distanceM: z.number(),
});

export const vicinitySchema = z
  .record(z.enum(vicinityTypeEnum.enumValues), z.array(vicinityItemSchema))
  .optional();

export const InsertFormSchema = z.object({
  estate: estateSchema,
  estateApartment: estateApartmentSchema,
  estateHouse: estateHouseSchema,
  multiselect: estateMultiSelectSchema,
  translations: translationSchema,
  media: mediaSchema,
  vicinity: vicinitySchema,
});

export type InsertFormSchema = z.infer<typeof InsertFormSchema>;

export const defaultInsertFormValues: InsertFormSchema = {
  estate: {
    sellerId: 0,
    brokerId: 0,

    category: estateCategoryEnum.enumValues[0],
    operationType: operationTypeEnum.enumValues[0],
    buildingCondition: buildingConditionEnum.enumValues[0],
    energyClass: energyClassEnum.enumValues[0],
    roadType: roadTypeEnum.enumValues[0],
    furnished: furnishedEnum.enumValues[0],
    currency: currencyEnum.enumValues[0],
    priceUnit: priceUnitEnum.enumValues[0],
    region: regionEnum.enumValues[0],

    usableArea: 0,
    totalFloorArea: 0,
    price: 0,
    costOfLiving: 0,
    commission: 0,
    refundableDeposit: 0,

    easyAccess: false,
    commissionPaidByOwner: false,

    readyDate: new Date(),
    advertLifetime: 7,

    city: "",
    street: "",
    latitude: 0,
    longitude: 0,
  },

  estateHouse: {
    houseCategory: houseCategoryEnum.enumValues[0],
    roomCount: roomCountEnum.enumValues[0],
    houseType: houseTypeEnum.enumValues[0],
    circuitBreaker: circuitBreakerEnum.enumValues[0],
    phase: phaseEnum.enumValues[0],

    reconstructionYear: 0,
    acceptanceYear: 0,
    floors: 0,
    undergroundFloors: 0,
    parkingLotsCount: 0,
    gardenArea: 0,
    buildingArea: 0,

    pool: false,
    cellar: false,
    garage: false,
    pvPanels: false,
    solarWaterHeating: false,
  },

  estateApartment: {
    flatClass: flatClassEnum.enumValues[0],
    buildingType: buildingTypeEnum.enumValues[0],
    apartmentPlan: apartmentPlanEnum.enumValues[0],

    floorNumber: 0,
    balconyArea: 0,
    loggiaArea: 0,
    terraceArea: 0,

    apartmentNumber: "",

    garden: false,
    parking: false,
    elevator: false,
  },

  multiselect: {
    estateHeatingSource: [heatingSourceEnum.enumValues[0]],
    estateHeatingElement: [heatingElementEnum.enumValues[0]],
    estateWaterHeatSource: [waterHeatSourceEnum.enumValues[0]],
    estateWater: [waterEnum.enumValues[0]],
    estateElectricity: [electricityEnum.enumValues[0]],
    estateTelecommunication: [telecommunicationEnum.enumValues[0]],
    estateInternetConnections: [internetConnectionEnum.enumValues[0]],
  },

  translations: {
    description: { ua: "", en: "" },
    title: { ua: "", en: "" },
  },

  media: [
    {
      url: "",
      type: mediaTypeEnum.enumValues[0],
      alt: "",
      isMain: false,
    },
  ],
};

export type InsertFormType = z.infer<typeof InsertFormSchema>;
