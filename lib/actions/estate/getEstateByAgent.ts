"use server";

import { db } from "@/lib/db";
import { estate, estateMedia } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { EstatePreview } from "./searchEstate";

export async function getEstatesByAgentId(
  agentId: string,
): Promise<EstatePreview[]> {
  const rows = await db
    .select({
      id: estate.id,
      category: estate.category,
      usableArea: estate.usableArea,
      operationType: estate.operationType,
      price: estate.price,
      street: estate.street,
      city: estate.city,
      image: estateMedia.url,
    })
    .from(estate)
    .leftJoin(estateMedia, eq(estateMedia.estateId, estate.id))
    .where(eq(estate.brokerId, agentId))
    .orderBy(desc(estateMedia.isMain), asc(estateMedia.id));

  const unique = new Map<number, (typeof rows)[number]>();

  for (const row of rows) {
    if (!unique.has(row.id)) {
      unique.set(row.id, row);
    }
  }

  return Array.from(unique.values()).map((e) => ({
    id: e.id,
    property_type: e.category,
    usable_area: e.usableArea,
    offer_type: e.operationType,
    price: Number(e.price),
    address: `${e.street}, ${e.city}`,
    image: e.image ?? null,
  }));
}
