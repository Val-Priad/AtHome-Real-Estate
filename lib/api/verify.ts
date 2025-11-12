"use server";

import { db } from "@/lib/db";
import { emailVerifications, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function verifyUser(token: string) {
  const record = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.token, token));

  if (!record.length)
    return { success: false, error: "Invalid or expired token" };

  const { email, passwordHash, expiresAt } = record[0];

  if (expiresAt.getTime() < Date.now())
    return { success: false, error: "Token expired" };

  await db.insert(users).values({
    email,
    passwordHash,
    emailVerified: new Date(),
    createdAt: new Date(),
  });

  await db
    .delete(emailVerifications)
    .where(eq(emailVerifications.token, token));

  return { success: true };
}
