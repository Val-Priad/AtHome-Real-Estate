"use server";

import { estate } from "@/db/schema";
import { db } from "@/lib/db";
import { count, inArray } from "drizzle-orm";

export async function getOffersCount() {
  const res = await db
    .select({
      count: count(),
    })
    .from(estate)
    .where(inArray(estate.status, ["Active", "Expiring"]));
  return res[0].count;
}
