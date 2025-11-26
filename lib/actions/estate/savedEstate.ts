"use server";

import { db } from "@/lib/db";
import { savedEstate } from "@/db/schema";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";

export async function addToSaved(estateId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const exists = await isInSaved(estateId);
  if (exists) {
    return;
  }

  await db.insert(savedEstate).values({
    userId: session.user.id,
    estateId: estateId,
  });
}

export async function removeFromSaved(estateId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await db
    .delete(savedEstate)
    .where(
      and(
        eq(savedEstate.userId, session.user.id),
        eq(savedEstate.estateId, estateId),
      ),
    );
}

export async function isInSaved(estateId: number) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const exists = await db
    .select()
    .from(savedEstate)
    .where(
      and(
        eq(savedEstate.userId, session.user.id),
        eq(savedEstate.estateId, estateId),
      ),
    );

  return exists.length > 0;
}
