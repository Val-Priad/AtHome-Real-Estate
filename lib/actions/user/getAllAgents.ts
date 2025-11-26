"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { and, eq, isNotNull, ne } from "drizzle-orm";

export async function getAllBrokers() {
  const brokers = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(
      and(eq(users.role, "agent"), ne(users.name, ""), isNotNull(users.name)),
    );

  return brokers;
}
