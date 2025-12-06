"use server";

import { db } from "@/lib/db";
import {
  estate,
  estateApartment,
  estateHouse,
  estateHeatingSource,
  estateHeatingElement,
  estateElectricity,
  estateInternet,
  estateTelecommunication,
  estateWater,
  estateTranslation,
  estateVicinity,
  estateMedia,
  vicinityTypeEnum,
  estateWaterHeating,
} from "@/db/schema";

import { InsertFormSchema } from "@/db/zodObjects";
import { z } from "zod";
import { eq } from "drizzle-orm";

export async function updateEstate(
  estateId: number,
  values: z.infer<typeof InsertFormSchema>,
) {
  try {
    return await db.transaction(async (tx) => {
      const expiresAt = new Date(
        values.estate.readyDate.getTime() +
          Number(values.estate.advertLifetime) * 24 * 60 * 60 * 1000,
      );

      await tx
        .update(estate)
        .set({
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
          price: values.estate.price.toFixed(2),
          priceUnit: values.estate.priceUnit,
          costOfLiving: values.estate.costOfLiving
            ? values.estate.costOfLiving.toFixed(2)
            : null,
          commission: values.estate.commission
            ? values.estate.commission.toFixed(2)
            : null,
          commissionPaidByOwner: values.estate.commissionPaidByOwner,
          refundableDeposit: values.estate.refundableDeposit
            ? values.estate.refundableDeposit.toFixed(2)
            : null,
          city: values.estate.city,
          street: values.estate.street,
          region: values.estate.region,
          latitude: values.estate.latitude,
          longitude: values.estate.longitude,
          updatedAt: new Date(),
        })
        .where(eq(estate.id, estateId));

      await tx
        .delete(estateApartment)
        .where(eq(estateApartment.estateId, estateId));
      await tx.delete(estateHouse).where(eq(estateHouse.estateId, estateId));

      if (values.estate.category === "Apartment") {
        await tx.insert(estateApartment).values({
          estateId,
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
          estateId,
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
        ["estateWaterHeatSource", estateWaterHeating, "waterHeatSource"],
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
        await tx.delete(table).where(eq(table.estateId, estateId));

        const items = values.multiselect[key];
        if (items?.length) {
          await tx.insert(table).values(
            items.map((value) => ({
              estateId,
              [column]: value,
            })),
          );
        }
      }

      await tx
        .delete(estateTranslation)
        .where(eq(estateTranslation.estateId, estateId));

      await tx.insert(estateTranslation).values(
        (["ua", "en"] as const).map((lang) => ({
          estateId,
          langCode: lang,
          title: values.translations.title[lang],
          description: values.translations.description[lang],
        })),
      );

      await tx
        .delete(estateVicinity)
        .where(eq(estateVicinity.estateId, estateId));

      if (values.vicinity) {
        const vicinityRows = Object.entries(values.vicinity).flatMap(
          ([type, items]) =>
            items?.map((item) => ({
              estateId,
              type: type as (typeof vicinityTypeEnum.enumValues)[number],
              name: item.name,
              latitude: item.latitude,
              longitude: item.longitude,
              distanceM: item.distanceM,
            })) ?? [],
        );

        if (vicinityRows.length) {
          await tx.insert(estateVicinity).values(vicinityRows);
        }
      }

      await tx.delete(estateMedia).where(eq(estateMedia.estateId, estateId));

      if (values.media?.length) {
        await tx.insert(estateMedia).values(
          values.media.map((m) => ({
            estateId,
            url: m.url,
            alt: m.alt ?? null,
            mediaType: m.type,
            isMain: m.isMain,
          })),
        );
      }

      return { success: true };
    });
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
