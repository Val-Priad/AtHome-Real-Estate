"use server";

import { db } from "@/lib/db";
import {
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
  estateVicinity,
  estateWater,
  vicinityTypeEnum,
} from "@/db/schema";
import { z } from "zod";
import { InsertFormSchema } from "@/db/zodObjects";
import { auth } from "@/auth";

export async function insertEstate(values: z.infer<typeof InsertFormSchema>) {
  try {
    const session = await auth();
    const currentUser = session?.user;

    if (!currentUser) {
      return { success: false, message: "Unauthorized" };
    }

    const status =
      currentUser.role === "user"
        ? ("Suggested" as const)
        : ("Active" as const);
    const sellerId = currentUser.role === "user" ? currentUser.id : null;

    return await db.transaction(async (tx) => {
      const expiresAt = new Date(
        values.estate.readyDate.getTime() +
          Number(values.estate.advertLifetime) * 24 * 60 * 60 * 1000,
      );

      const insertData = {
        sellerId: sellerId,
        brokerId: values.estate.brokerId ?? null,
        category: values.estate.category,
        operationType: values.estate.operationType,
        buildingCondition: values.estate.buildingCondition,
        energyClass: values.estate.energyClass,
        usableArea: values.estate.usableArea ?? null,
        totalFloorArea: values.estate.totalFloorArea ?? null,
        roadType: values.estate.roadType,
        furnished: values.estate.furnished,
        easyAccess: values.estate.easyAccess,
        readyDate: values.estate.readyDate.toISOString().split("T")[0],
        advertLifetime: Number(values.estate.advertLifetime),
        expiresAt,
        price: values.estate.price?.toFixed(2),
        priceUnit: values.estate.priceUnit,
        costOfLiving: values.estate.costOfLiving?.toFixed(2) ?? null,
        commission: values.estate.commission?.toFixed(2) ?? null,
        commissionPaidByOwner: values.estate.commissionPaidByOwner,
        refundableDeposit: values.estate.refundableDeposit?.toFixed(2) ?? null,
        city: values.estate.city,
        street: values.estate.street,
        region: values.estate.region,
        latitude: values.estate.latitude,
        longitude: values.estate.longitude,
        status: status,
      };

      const [estateRecord] = await tx
        .insert(estate)
        .values(insertData)
        .returning();

      if (values.estate.category === "Apartment") {
        await tx.insert(estateApartment).values({
          estateId: estateRecord.id,
          flatClass: values.estateApartment.flatClass ?? null,
          buildingType: values.estateApartment.buildingType ?? null,
          apartmentPlan: values.estateApartment.apartmentPlan ?? null,
          floorNumber: values.estateApartment.floorNumber ?? null,
          apartmentNumber: values.estateApartment.apartmentNumber ?? null,
          garden: values.estateApartment.garden ?? false,
          parking: values.estateApartment.parking ?? false,
          elevator: values.estateApartment.elevator ?? false,
          balconyArea: values.estateApartment.balconyArea ?? null,
          loggiaArea: values.estateApartment.loggiaArea ?? null,
          terraceArea: values.estateApartment.terraceArea ?? null,
        });
      }

      if (values.estate.category === "House") {
        await tx.insert(estateHouse).values({
          estateId: estateRecord.id,
          houseCategory: values.estateHouse.houseCategory ?? null,
          roomCount: values.estateHouse.roomCount ?? null,
          houseType: values.estateHouse.houseType ?? null,
          circuitBreaker: values.estateHouse.circuitBreaker ?? null,
          phase: values.estateHouse.phase ?? null,
          reconstructionYear: values.estateHouse.reconstructionYear ?? null,
          acceptanceYear: values.estateHouse.acceptanceYear ?? null,
          floors: values.estateHouse.floors ?? null,
          undergroundFloors: values.estateHouse.undergroundFloors ?? null,
          parkingLotsCount: values.estateHouse.parkingLotsCount ?? null,
          gardenArea: values.estateHouse.gardenArea ?? null,
          buildingArea: values.estateHouse.buildingArea ?? null,
          pool: values.estateHouse.pool ?? false,
          cellar: values.estateHouse.cellar ?? false,
          garage: values.estateHouse.garage ?? false,
          pvPanels: values.estateHouse.pvPanels ?? false,
          solarWaterHeating: values.estateHouse.solarWaterHeating ?? false,
        });
      }

      const multiselectMap = [
        ["estateHeatingSource", estateHeatingSource, "heatingSource"],
        ["estateElectricity", estateElectricity, "electricity"],
        ["estateHeatingElement", estateHeatingElement, "heatingElement"],
        ["estateInternetConnections", estateInternet, "connectionType"],
        [
          "estateTelecommunication",
          estateTelecommunication,
          "telecommunication",
        ],
        ["estateWater", estateWater, "water"],
      ] as const;

      for (const [key, table, column] of multiselectMap) {
        const items = values.multiselect[key];
        if (items?.length) {
          const rows = items.map((value) => ({
            estateId: estateRecord.id,
            [column]: value,
          }));
          await tx.insert(table).values(rows);
        }
      }

      const translations = (["ua", "en"] as const).map((lang) => ({
        estateId: estateRecord.id,
        langCode: lang,
        title: values.translations.title[lang],
        description: values.translations.description[lang],
      }));
      await tx.insert(estateTranslation).values(translations);

      if (values.vicinity) {
        const vicinityRows = Object.entries(values.vicinity).flatMap(
          ([type, items]) => {
            if (!items) {
              return [];
            }
            return items.map((item) => ({
              estateId: estateRecord.id,
              type: type as (typeof vicinityTypeEnum.enumValues)[number],
              name: item.name,
              latitude: item.latitude,
              longitude: item.longitude,
              distanceM: item.distanceM,
            }));
          },
        );
        if (vicinityRows.length) {
          await tx.insert(estateVicinity).values(vicinityRows);
        }
      }

      if (values.media?.length) {
        const mediaRows = values.media.map((m) => ({
          estateId: estateRecord.id,
          url: m.url,
          alt: m.alt ?? null,
          mediaType: m.type,
          isMain: m.isMain,
        }));

        await tx.insert(estateMedia).values(mediaRows);
      }

      return { success: true, estateId: estateRecord.id };
    });
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
