"use server";

import { estate, estateMedia, estateTranslation, users } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";

export async function getEstateTable() {
  const rows = await db
    .select({
      id: estate.id,

      photo: sql<string | null>`
        (
          SELECT em.url 
          FROM ${estateMedia} em
          WHERE em.estate_id = ${estate.id}
          ORDER BY em.is_main DESC, em.id ASC
          LIMIT 1
        )
      `,

      title: estateTranslation.title,

      category: estate.category,
      operationType: estate.operationType,
      price: estate.price,
      usableArea: estate.usableArea,
      street: estate.street,
      city: estate.city,
      region: estate.region,

      createdAt: estate.createdAt,
      expiresAt: estate.expiresAt,
      status: estate.status,
      agentName: users.name,
      agentId: users.id,
    })
    .from(estate)

    .leftJoin(
      estateTranslation,
      and(
        eq(estateTranslation.estateId, estate.id),
        eq(estateTranslation.langCode, "en"),
      ),
    )

    .leftJoin(users, eq(users.id, estate.brokerId));

  return rows.map((row) => {
    return {
      id: row.id,
      photo: row.photo ?? null,
      title: row.title ?? "Untitled",
      category: row.category,
      operationType: row.operationType,
      price: Number(row.price),
      usableArea: row.usableArea,
      region: row.region,

      agentName: row.agentName ? `${row.agentName}` : "No agent",
      agentId: row.agentId,

      createdAt: row.createdAt,
      expiresAt: row.expiresAt,

      status: row.status,
    };
  });
}
