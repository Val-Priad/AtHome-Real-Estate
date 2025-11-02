"use server";

import { db } from "@/lib/db";
import {
  estate,
  estateApartment,
  estateHouse,
  estateTranslation,
  estateMedia,
  estateHeatingSource,
  estateHeatingElement,
  estateWaterHeating,
  estateWater,
  estateElectricity,
  estateTelecommunication,
  estateInternet,
} from "@/db/schema";
import { EstateInput } from "@/db/types";

/**
 * Universal action for inserting Estate (Apartment or House) into DB
 */
export async function createEstateAction(input: EstateInput) {
  const trx = await db.transaction(async (tx) => {
    // 1 Create base estate
    const [createdEstate] = await tx
      .insert(estate)
      .values(input.estate)
      .returning({ id: estate.id });

    const estateId = createdEstate.id;

    // 2 Insert type-specific data
    if ("estateApartment" in input) {
      await tx.insert(estateApartment).values({
        ...input.estateApartment,
        estateId,
      });
    }

    if ("estateHouse" in input) {
      await tx.insert(estateHouse).values({
        ...input.estateHouse,
        estateId,
      });
    }

    // 3 Translation
    if (input.estateTranslation) {
      await tx.insert(estateTranslation).values({
        ...input.estateTranslation,
        estateId,
      });
    }

    // 4 Media
    if (input.estateMedia?.length) {
      await tx.insert(estateMedia).values(
        input.estateMedia.map((m) => ({
          ...m,
          estateId,
        })),
      );
    }

    // 5 Many-to-many relations (heating, water, etc.)
    const insertRelation = async (
      table:
        | typeof estateHeatingSource
        | typeof estateHeatingElement
        | typeof estateWaterHeating
        | typeof estateWater
        | typeof estateElectricity
        | typeof estateTelecommunication
        | typeof estateInternet,
      values?: string[],
      columnName: string = "name",
    ) => {
      if (!values?.length) return;

      await tx.insert(table).values(
        values.map((value) => ({
          estateId,
          [columnName]: value,
        })),
      );
    };

    await insertRelation(estateHeatingSource, input.estateHeatingSource);
    await insertRelation(estateHeatingElement, input.estateHeatingElement);
    await insertRelation(estateWaterHeating, input.estateWaterHeating);
    await insertRelation(estateWater, input.estateWater);
    await insertRelation(estateElectricity, input.estateElectricity);
    await insertRelation(
      estateTelecommunication,
      input.estateTelecommunication,
    );
    await insertRelation(estateInternet, input.estateInternet);

    return estateId;
  });

  return { success: true, estateId: trx };
}
