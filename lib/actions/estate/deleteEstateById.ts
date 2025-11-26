"use server";

import { estate } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function deleteEstateById(id: number) {
  try {
    if (!id || isNaN(id)) {
      throw new Error("Invalid estate id");
    }

    const result = await db
      .delete(estate)
      .where(eq(estate.id, id))
      .returning({ id: estate.id });

    if (result.length === 0) {
      return { success: false, message: "Estate not found" };
    }

    return { success: true, deletedId: result[0].id };
  } catch (err) {
    console.error("Failed to delete estate:", err);
    return { success: false, message: "Internal server error" };
  }
}
