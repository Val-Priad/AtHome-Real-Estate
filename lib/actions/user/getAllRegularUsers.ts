"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllRegularUsers() {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phoneNumber: users.phoneNumber,
        description: users.description,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.role, "user"));

    return {
      success: true as const,
      data: result,
    };
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return {
      success: false as const,
      message: "Internal server error",
    };
  }
}
