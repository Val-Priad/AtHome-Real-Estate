"use server";

import { db } from "@/lib/db";
import { estate, estateMedia } from "@/db/schema";
import { eq } from "drizzle-orm";
import { EstatePreview } from "./searchEstate";

export async function getEstatesByAgentId(
  agentId: string,
): Promise<EstatePreview[]> {
  const estates = await db
    .select()
    .from(estate)
    .where(eq(estate.brokerId, agentId));

  const result: EstatePreview[] = [];

  for (const e of estates) {
    const photos = await db
      .select()
      .from(estateMedia)
      .where(eq(estateMedia.estateId, e.id));

    let image = photos.find((p) => p.isMain === true)?.url;

    if (!image && photos.length > 0) {
      image = photos[0].url;
    }

    result.push({
      id: e.id,
      property_type: e.category,
      usable_area: e.usableArea,
      offer_type: e.operationType,
      price: Number(e.price),
      address: `${e.street}, ${e.city}`,
      image: image ?? null,
    });
  }

  return result;
}
