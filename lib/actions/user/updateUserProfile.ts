"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UserProfileValues } from "@/db/zodObjects";

export async function updateUserProfile(values: UserProfileValues) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Not authenticated" };
    }

    const userId = session.user.id;

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existing) {
      return { error: "User not found" };
    }

    const updates: Partial<typeof users.$inferInsert> = {};

    if (values.name?.trim()) updates.name = values.name;
    if (values.phoneNumber?.trim()) updates.phoneNumber = values.phoneNumber;
    if (values.description?.trim()) updates.description = values.description;
    if (values.image?.trim()) updates.image = values.image;

    updates.updatedAt = new Date();

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    return { success: true, user: updated };
  } catch (err) {
    if (err instanceof Error)
      return { error: err.message || "Unexpected server error" };
  }
}
