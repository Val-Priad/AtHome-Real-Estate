"use server";
import { estate, estateMedia } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export type FilteredEstatePreview = {
  id: number;
  property_type: "Apartment" | "House";
  usable_area: number | null;
  offer_type: "Sale" | "Lease";
  price: number;
  address: string;
  image: string | null;
};

export async function getEstateByFilters(filters: string) {
  const estates = await db.select().from(estate);

  const result = [];

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
