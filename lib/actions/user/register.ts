"use server";

import { db } from "@/lib/db";
import { emailVerifications, users } from "@/db/schema";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { sendVerificationEmail } from "@/lib/actions/sendVerificationEmail";
import { eq } from "drizzle-orm";

export async function registerUser(values: {
  email: string;
  password: string;
}) {
  const HOUR = 1000 * 60 * 60;
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, values.email));

  if (existing.length > 0) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(values.password, 10);
  const token = randomUUID();

  await db.insert(emailVerifications).values({
    email: values.email,
    passwordHash,
    token,
    expiresAt: new Date(Date.now() + HOUR),
  });

  await sendVerificationEmail(values.email, token);

  return { success: true };
}
