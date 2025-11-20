"use server";

import { db } from "@/lib/db";
import {
  estate,
  estateApartment,
  estateHouse,
  estateMedia,
  estateVicinity,
  estateHeatingSource,
  estateHeatingElement,
  estateWaterHeating,
  estateWater,
  estateElectricity,
  estateTelecommunication,
  estateInternet,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getEstateById(id: number) {
  const main = await db.query.estate.findFirst({
    where: eq(estate.id, id),
  });

  if (!main) return null;

  const translation = await db.query.estateTranslation.findFirst({
    where: (table) => eq(table.estateId, id) && eq(table.langCode, "en"),
  });

  const media = await db.query.estateMedia.findMany({
    where: eq(estateMedia.estateId, id),
    orderBy: [desc(estateMedia.isMain), desc(estateMedia.createdAt)],
  });

  const apartment = await db.query.estateApartment.findFirst({
    where: eq(estateApartment.estateId, id),
  });

  const house = await db.query.estateHouse.findFirst({
    where: eq(estateHouse.estateId, id),
  });

  const vicinity = await db.query.estateVicinity.findMany({
    where: eq(estateVicinity.estateId, id),
  });

  const heatingSources = await db.query.estateHeatingSource.findMany({
    where: eq(estateHeatingSource.estateId, id),
  });

  const heatingElements = await db.query.estateHeatingElement.findMany({
    where: eq(estateHeatingElement.estateId, id),
  });

  const waterHeating = await db.query.estateWaterHeating.findMany({
    where: eq(estateWaterHeating.estateId, id),
  });

  const water = await db.query.estateWater.findMany({
    where: eq(estateWater.estateId, id),
  });

  const electricity = await db.query.estateElectricity.findMany({
    where: eq(estateElectricity.estateId, id),
  });

  const telecommunication = await db.query.estateTelecommunication.findMany({
    where: eq(estateTelecommunication.estateId, id),
  });

  const internet = await db.query.estateInternet.findMany({
    where: eq(estateInternet.estateId, id),
  });

  return {
    estate: main,

    translation,
    media,
    vicinity,

    apartment,
    house,

    multiselect: {
      heatingSources,
      heatingElements,
      waterHeating,
      water,
      electricity,
      telecommunication,
      internet,
    },
  };
}

export type EstateData = Awaited<ReturnType<typeof getEstateById>>;
