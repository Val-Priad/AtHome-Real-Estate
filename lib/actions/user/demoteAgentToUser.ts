"use server";

import { db } from "@/lib/db";
import { users, estate } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function demoteAgentToUser(agentId: string) {
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

    const agent = existing[0];

    if (agent.role !== "agent") {
      return {
        success: false,
        message: "Only agents can be demoted",
      };
    }

    await db
      .update(estate)
      .set({ brokerId: null })
      .where(eq(estate.brokerId, agentId));

    const result = await db
      .update(users)
      .set({
        role: "user",
        updatedAt: new Date(),
      })
      .where(eq(users.id, agentId))
      .returning({ id: users.id });

    if (result.length === 0) {
      return {
        success: false,
        message: "Failed to demote agent",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to demote agent:", err);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
