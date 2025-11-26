"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteAgent(agentId: string) {
  try {
    if (!agentId || typeof agentId !== "string") {
      return { success: false, message: "Invalid agent id" };
    }

    const existing = await db
      .select({
        id: users.id,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, agentId));

    if (existing.length === 0) {
      return { success: false, message: "Agent not found" };
    }

    if (existing[0].role !== "agent") {
      return { success: false, message: "User is not an agent" };
    }

    const deleted = await db
      .delete(users)
      .where(eq(users.id, agentId))
      .returning({ id: users.id });

    if (deleted.length === 0) {
      return { success: false, message: "Failed to delete agent" };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to delete agent:", err);
    return { success: false, message: "Internal server error" };
  }
}
