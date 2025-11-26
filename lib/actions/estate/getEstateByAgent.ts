"use server";

import { db } from "@/lib/db";
import { estate, estateMedia } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
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

      image: sql<string | null>`
        (
          SELECT em.url
          FROM ${estateMedia} em
          WHERE em.estate_id = ${estate.id}
          ORDER BY em.is_main DESC, em.id ASC
          LIMIT 1
        )
      `,
    })
    .from(estate)
    .where(eq(estate.brokerId, agentId));

  return rows.map((e) => ({
    id: e.id,
    property_type: e.category,
    usable_area: e.usableArea,
    offer_type: e.operationType,
    price: Number(e.price),
    address: `${e.street}, ${e.city}`,
    image: e.image ?? null,
  }));
}
