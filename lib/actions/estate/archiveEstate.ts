"use server";

import { estate } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function archiveEstate(id: number) {
  try {
    const result = await db
      .update(estate)
      .set({ status: "Archived" })
      .where(eq(estate.id, id))
      .returning({ id: estate.id });

    if (result.length === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to archive estate:", err);
    return { success: false, message: err };
  }
}
