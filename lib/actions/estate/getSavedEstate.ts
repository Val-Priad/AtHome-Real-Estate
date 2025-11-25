"use server";

import { db } from "@/lib/db";
import { wishList, estate, estateMedia } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";

export async function getSavedEstate() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return [];
    }

    const saved = await db
      .select({
        estateId: wishList.estateId,
      })
      .from(wishList)
      .where(eq(wishList.userId, session.user.id));

    const ids = saved
      .map((s) => s.estateId)
      .filter((id): id is number => id !== null);

    if (ids.length === 0) return [];

    const estates = await db
      .select({
        id: estate.id,
        category: estate.category,
        usableArea: estate.usableArea,
        operationType: estate.operationType,
        price: estate.price,
        street: estate.street,
        city: estate.city,
      })
      .from(estate)
      .where(inArray(estate.id, ids as readonly number[]));

    const media = await db
      .select({
        id: estateMedia.id,
        estateId: estateMedia.estateId,
        url: estateMedia.url,
        isMain: estateMedia.isMain,
      })
      .from(estateMedia)
      .where(inArray(estateMedia.estateId, ids as readonly number[]));

    return estates.map((e) => {
      const mainImage =
        media.find((m) => m.estateId === e.id && m.isMain)?.url ??
        media.find((m) => m.estateId === e.id)?.url ??
        null;

      return {
        id: e.id,
        property_type: e.category,
        usable_area: e.usableArea,
        offer_type: e.operationType,
        price: Number(e.price),
        address: `${e.street}, ${e.city}`,
        image: mainImage,
      };
    });
  } catch (err) {
    console.error("WISHLIST ERROR:", err);
    throw new Error("Failed to fetch saved estates");
  }
}
