"use server";

import { db } from "@/lib/db";
import { savedEstate, estate, estateMedia } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function getSavedEstate() {
  try {
    const session = await auth();

    if (!session?.user?.id) return [];

    const saved = await db
      .select({ estateId: savedEstate.estateId })
      .from(savedEstate)
      .where(eq(savedEstate.userId, session.user.id));

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
      .where(inArray(estate.id, ids as readonly number[]));

    return estates.map((e) => ({
      id: e.id,
      property_type: e.category,
      usable_area: e.usableArea,
      offer_type: e.operationType,
      price: Number(e.price),
      address: `${e.street}, ${e.city}`,
      image: e.image ?? null,
    }));
  } catch (err) {
    console.error("WISHLIST ERROR:", err);
    throw new Error("Failed to fetch saved estates");
  }
}
