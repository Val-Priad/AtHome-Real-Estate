"use server";

import { db } from "@/lib/db";
import { savedEstate, estate, estateMedia } from "@/db/schema";
import { eq, inArray, desc, asc } from "drizzle-orm";
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
      .where(inArray(estate.id, ids as readonly number[]))
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
  } catch (err) {
    console.error("WISHLIST ERROR:", err);
    throw new Error("Failed to fetch saved estates");
  }
}
