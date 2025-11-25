import {
  apartmentPlanEnum,
  buildingConditionEnum,
  buildingTypeEnum,
  energyClassEnum,
  estate,
  estateApartment,
  estateElectricity,
  estateHeatingElement,
  estateHeatingSource,
  estateHouse,
  estateInternet,
  estateMedia,
  estateTelecommunication,
  estateTranslation,
  estateWater,
  estateWaterHeating,
  flatClassEnum,
  houseCategoryEnum,
  houseTypeEnum,
  internetConnectionEnum,
  operationTypeEnum,
  regionEnum,
  roomCountEnum,
  users,
  vicinityTypeEnum,
  waterHeatSourceEnum,
} from "./schema";

export type User = typeof users.$inferSelect;

export type EstateInsert = typeof estate.$inferInsert;
export type EstateSelect = typeof estate.$inferSelect;

export type EstateApartmentInsert = typeof estateApartment.$inferInsert;
export type EstateApartmentSelect = typeof estateApartment.$inferSelect;

export type EstateHouseInsert = typeof estateHouse.$inferInsert;
export type EstateHouseSelect = typeof estateHouse.$inferSelect;

export type EstateTranslationInsert = typeof estateTranslation.$inferInsert;
export type EstateTranslationSelect = typeof estateTranslation.$inferSelect;

export type EstateMediaInsert = typeof estateMedia.$inferInsert;
export type EstateMediaSelect = typeof estateMedia.$inferSelect;

export type EstateHeatingSourceInsert = typeof estateHeatingSource.$inferInsert;
export type EstateHeatingElementInsert =
  typeof estateHeatingElement.$inferInsert;
export type EstateWaterHeatingInsert = typeof estateWaterHeating.$inferInsert;
export type EstateWaterInsert = typeof estateWater.$inferInsert;
export type EstateElectricityInsert = typeof estateElectricity.$inferInsert;
export type EstateTelecommunicationInsert =
  typeof estateTelecommunication.$inferInsert;
export type EstateInternetInsert = typeof estateInternet.$inferInsert;

export type EstateInput =
  | {
      estate: EstateInsert;
      estateApartment: EstateApartmentInsert;
      estateTranslation: EstateTranslationInsert;
      estateMedia: EstateMediaInsert[];
      estateHeatingSource?: EstateHeatingSourceInsert["heatingSource"][];
      estateHeatingElement?: EstateHeatingElementInsert["heatingElement"][];
      estateWaterHeating?: EstateWaterHeatingInsert["waterHeatSource"][];
      estateWater?: EstateWaterInsert["water"][];
      estateElectricity?: EstateElectricityInsert["electricity"][];
      estateTelecommunication?: EstateTelecommunicationInsert["telecommunication"][];
      estateInternet?: EstateInternetInsert["connectionType"][];
    }
  | {
      estate: EstateInsert;
      estateHouse: EstateHouseInsert;
      estateTranslation: EstateTranslationInsert;
      estateMedia: EstateMediaInsert[];
      estateHeatingSource?: EstateHeatingSourceInsert["heatingSource"][];
      estateHeatingElement?: EstateHeatingElementInsert["heatingElement"][];
      estateWaterHeating?: EstateWaterHeatingInsert["waterHeatSource"][];
      estateWater?: EstateWaterInsert["water"][];
      estateElectricity?: EstateElectricityInsert["electricity"][];
      estateTelecommunication?: EstateTelecommunicationInsert["telecommunication"][];
      estateInternet?: EstateInternetInsert["connectionType"][];
    };

export type RegionEnum = (typeof regionEnum.enumValues)[number];
export type OfferTypeEnum = (typeof operationTypeEnum.enumValues)[number];
export type ConditionEnum = (typeof buildingConditionEnum.enumValues)[number];
export type EnergyClassEnum = (typeof energyClassEnum.enumValues)[number];

export type FlatClassEnum = (typeof flatClassEnum.enumValues)[number];
export type BuildingMaterialEnum = (typeof buildingTypeEnum.enumValues)[number];
export type ApartmentPlanEnum = (typeof apartmentPlanEnum.enumValues)[number];

export type HouseCategoryEnum = (typeof houseCategoryEnum.enumValues)[number];
export type HouseTypeEnum = (typeof houseTypeEnum.enumValues)[number];

export type WaterHeatEnum = (typeof waterHeatSourceEnum.enumValues)[number];
export type InternetConnectionEnum =
  (typeof internetConnectionEnum.enumValues)[number];

export type FacilityEnum = (typeof vicinityTypeEnum.enumValues)[number];
export type HousePlanEnum = (typeof roomCountEnum.enumValues)[number];
