"use server";

import { db } from "@/lib/db";
import { wishList } from "@/db/schema";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";

export async function addToWishlist(estateId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const exists = await isInWishlist(estateId);
  if (exists) {
    return;
  }

  await db.insert(wishList).values({
    userId: session.user.id,
    estateId: estateId,
  });
}

export async function removeFromWishlist(estateId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await db
    .delete(wishList)
    .where(
      and(
        eq(wishList.userId, session.user.id),
        eq(wishList.estateId, estateId),
      ),
    );
}

export async function isInWishlist(estateId: number) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const exists = await db
    .select()
    .from(wishList)
    .where(
      and(
        eq(wishList.userId, session.user.id),
        eq(wishList.estateId, estateId),
      ),
    );

  return exists.length > 0;
}
