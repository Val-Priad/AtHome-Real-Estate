"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function promoteUserToAgent(userId: string) {
  try {
    if (!userId || typeof userId !== "string") {
      return { success: false, message: "Invalid user id" };
    }

    const existing = await db
      .select({
        id: users.id,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (existing.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = existing[0];

    if (user.role !== "user") {
      return {
        success: false,
        message: "Only regular users can be promoted to agents",
      };
    }

    const result = await db
      .update(users)
      .set({
        role: "agent",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    if (result.length === 0) {
      return {
        success: false,
        message: "Failed to promote user",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to promote user:", err);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
