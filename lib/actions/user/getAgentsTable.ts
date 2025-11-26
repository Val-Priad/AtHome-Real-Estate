"use server";

import { db } from "@/lib/db";
import { users, estate } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export type AgentWithEstateCount = {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  description: string | null;
  image: string | null;
  createdAt: Date;
  estatesCount: number;
};

export async function getAgentsTable() {
  try {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phoneNumber: users.phoneNumber,
        description: users.description,
        image: users.image,
        createdAt: users.createdAt,
        estatesCount: sql<number>`count(${estate.id})`.mapWith(Number),
      })
      .from(users)
      .leftJoin(estate, eq(estate.brokerId, users.id))
      .where(eq(users.role, "agent"))
      .groupBy(
        users.id,
        users.name,
        users.email,
        users.phoneNumber,
        users.description,
        users.image,
        users.createdAt,
      );

    return {
      success: true as const,
      data: rows as AgentWithEstateCount[],
    };
  } catch (err) {
    console.error("Failed to load agents with estate count:", err);

    return {
      success: false as const,
      message: "Internal server error while loading agents",
    };
  }
}
