"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getUserById(id: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, "agent")))
    .limit(1);
  return user ?? null;
}
