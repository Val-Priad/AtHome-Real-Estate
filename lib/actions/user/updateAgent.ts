"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UserProfileValues } from "@/db/zodObjects";

export async function updateAgent(userId: string, values: UserProfileValues) {
  try {
    if (!userId || typeof userId !== "string") {
      return { success: false, message: "Invalid user id" };
    }

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId));

    if (existing.length === 0) {
      return { success: false, message: "User not found" };
    }

    await db
      .update(users)
      .set({
        name: values.name ?? null,
        phoneNumber: values.phoneNumber ?? null,
        description: values.description ?? null,
        image: values.image ?? null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (err) {
    console.error("Failed to update user:", err);
    return { success: false, message: "Internal server error" };
  }
}
