"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteUser(userId: string) {
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

    const deleted = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    if (deleted.length === 0) {
      return { success: false, message: "Failed to delete user" };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to delete user:", err);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
