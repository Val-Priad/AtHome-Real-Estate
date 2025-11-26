"use server";

import { db } from "@/lib/db";
import { estate } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function prolongEstate(estateId: number, days: number) {
  try {
    // Валидация входных данных
    if (!estateId || !days) {
      return { success: false, message: "Invalid parameters" };
    }

    return await db.transaction(async (tx) => {
      const newExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      const result = await tx
        .update(estate)
        .set({
          expiresAt: newExpiresAt,
          status: "Active",
          updatedAt: new Date(),
        })
        .where(eq(estate.id, estateId))
        .returning({ id: estate.id });

      // Проверяем, что запись реально обновилась
      if (result.length === 0) {
        return { success: false, message: "Estate not found" };
      }

      return { success: true };
    });
  } catch (err) {
    console.error("Error in prolongEstate:", err);
    return { success: false, message: "Internal server error" };
  }
}
