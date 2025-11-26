"use server";

import { and, eq, gt, gte, inArray, isNotNull, lte } from "drizzle-orm";
import {
  estate,
  estateApartment,
  estateHouse,
  estateInternet,
  estateMedia,
  estateVicinity,
  estateWaterHeating,
} from "@/db/schema";
import type { CheckboxStateType, InputStateType } from "@/app/search/page";
import { db } from "@/lib/db";

export type EstatePreview = {
  id: number;
  property_type: "Apartment" | "House";
  usable_area: number | null;
  offer_type: "Sale" | "Lease";
  price: number;
  address: string;
  image: string | null;
};

export async function searchEstate(
  payload: InputStateType &
    CheckboxStateType & {
      estateType: "apartment" | "house" | null;
    },
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any[] = [];

    //
    // ============================
    // ESTATE FILTERS
    // ============================
    //
    if (payload.estate.region.length > 0) {
      where.push(inArray(estate.region, payload.estate.region));
    }

    if (payload.estate.offerType.length > 0) {
      where.push(inArray(estate.operationType, payload.estate.offerType));
    }

    if (payload.estate.condition.length > 0) {
      where.push(inArray(estate.buildingCondition, payload.estate.condition));
    }

    if (payload.estate.energyClass.length > 0) {
      where.push(inArray(estate.energyClass, payload.estate.energyClass));
    }

    const accessories = payload.estate.accessories;

    if (accessories.includes("Furnished")) {
      where.push(inArray(estate.furnished, ["Yes", "Partially"]));
    }

    if (accessories.includes("Easy Access")) {
      where.push(eq(estate.easyAccess, true));
    }

    //
    // ============================
    // NUMERIC FILTERS
    // ============================
    //

    // USABLE AREA
    if (payload.usableAreaFrom !== undefined) {
      where.push(gte(estate.usableArea, Number(payload.usableAreaFrom)));
    }

    if (payload.usableAreaTo !== undefined) {
      where.push(lte(estate.usableArea, Number(payload.usableAreaTo)));
    }

    // PRICE (numeric - в Drizzle обычно string)
    if (payload.priceFrom !== undefined) {
      where.push(gte(estate.price, String(payload.priceFrom)));
    }

    if (payload.priceTo !== undefined) {
      where.push(lte(estate.price, String(payload.priceTo)));
    }

    //
    // ============================
    // APARTMENT FILTERS
    // ============================
    //
    if (payload.estateType === "apartment") {
      if (payload.estateType === "apartment") {
        where.push(eq(estate.category, "Apartment"));
      }

      if (payload.estateApartment.flatClass.length > 0) {
        where.push(
          inArray(estateApartment.flatClass, payload.estateApartment.flatClass),
        );
      }

      if (payload.estateApartment.buildingType.length > 0) {
        where.push(
          inArray(
            estateApartment.buildingType,
            payload.estateApartment.buildingType,
          ),
        );
      }

      if (payload.estateApartment.apartmentPlan.length > 0) {
        where.push(
          inArray(
            estateApartment.apartmentPlan,
            payload.estateApartment.apartmentPlan,
          ),
        );
      }

      const a = payload.estateApartment.accessories;

      if (a.includes("Garden")) {
        where.push(eq(estateApartment.garden, true));
      }

      if (a.includes("Parking")) {
        where.push(eq(estateApartment.parking, true));
      }

      if (a.includes("Elevator")) {
        where.push(eq(estateApartment.elevator, true));
      }

      if (a.includes("Balcony")) {
        where.push(gt(estateApartment.balconyArea, 0));
      }

      if (a.includes("Loggia")) {
        where.push(gt(estateApartment.loggiaArea, 0));
      }

      if (a.includes("Terrace")) {
        where.push(gt(estateApartment.terraceArea, 0));
      }
    }

    //
    // ============================
    // HOUSE FILTERS
    // ============================
    //
    if (payload.estateType === "house") {
      if (payload.estateType === "house") {
        where.push(eq(estate.category, "House"));
      }

      if (payload.estateHouse.houseCategory.length > 0) {
        where.push(
          inArray(estateHouse.houseCategory, payload.estateHouse.houseCategory),
        );
      }

      if (payload.estateHouse.housePlan.length > 0) {
        where.push(
          inArray(estateHouse.roomCount, payload.estateHouse.housePlan),
        );
      }

      if (payload.estateHouse.houseType.length > 0) {
        where.push(
          inArray(estateHouse.houseType, payload.estateHouse.houseType),
        );
      }

      const h = payload.estateHouse.accessories;

      if (h.includes("Garden")) {
        where.push(gt(estateHouse.gardenArea, 0));
      }

      if (h.includes("Parking")) {
        where.push(gt(estateHouse.parkingLotsCount, 0));
      }

      if (h.includes("Garage")) {
        where.push(eq(estateHouse.garage, true));
      }

      if (h.includes("Cellar")) {
        where.push(eq(estateHouse.cellar, true));
      }

      if (h.includes("Pool")) {
        where.push(eq(estateHouse.pool, true));
      }

      if (h.includes("Multi-story")) {
        where.push(gt(estateHouse.floors, 1));
      }
    }

    //
    // ============================
    // MULTISELECT FILTERS
    // ============================
    //

    // WATER HEATING SOURCE
    if (payload.multiselect.waterHeatSource.length > 0) {
      where.push(
        inArray(
          estate.id,
          db
            .select({ estateId: estateWaterHeating.estateId })
            .from(estateWaterHeating)
            .where(
              inArray(
                estateWaterHeating.waterHeatSource,
                payload.multiselect.waterHeatSource,
              ),
            ),
        ),
      );
    }

    // INTERNET CONNECTIONS
    if (payload.multiselect.internetConnections.length > 0) {
      where.push(
        inArray(
          estate.id,
          db
            .select({ estateId: estateInternet.estateId })
            .from(estateInternet)
            .where(
              inArray(
                estateInternet.connectionType,
                payload.multiselect.internetConnections,
              ),
            ),
        ),
      );
    }

    //
    // ============================
    // VICINITY FILTERS
    // ============================
    //

    if (payload.vicinity.facilitiesNearby.length > 0) {
      const maxDistanceMeters = Number(payload.distanceToFacilities) * 1000;

      where.push(
        inArray(
          estate.id,
          db
            .select({ estateId: estateVicinity.estateId })
            .from(estateVicinity)
            .where(
              and(
                inArray(estateVicinity.type, payload.vicinity.facilitiesNearby),
                lte(estateVicinity.distanceM, maxDistanceMeters),
              ),
            ),
        ),
      );
    }

    //
    // ============================
    // ONLY ACTIVE estates
    // ============================
    //

    where.push(inArray(estate.status, ["Active", "Expiring"]));

    //
    // ============================
    //  ESTATES WITH AGENT
    // ============================
    //

    where.push(isNotNull(estate.brokerId));

    //
    // ============================
    // SELECT estates
    // ============================
    //

    let estates;

    if (payload.estateType === "apartment") {
      estates = await db
        .select({
          id: estate.id,
          category: estate.category,
          usableArea: estate.usableArea,
          operationType: estate.operationType,
          price: estate.price,
          street: estate.street,
          city: estate.city,
        })
        .from(estate)
        .leftJoin(estateApartment, eq(estateApartment.estateId, estate.id))
        .where(where.length ? and(...where) : undefined);
    } else if (payload.estateType === "house") {
      estates = await db
        .select({
          id: estate.id,
          category: estate.category,
          usableArea: estate.usableArea,
          operationType: estate.operationType,
          price: estate.price,
          street: estate.street,
          city: estate.city,
        })
        .from(estate)
        .leftJoin(estateHouse, eq(estateHouse.estateId, estate.id))
        .where(where.length ? and(...where) : undefined);
    } else {
      // When type is null - search BOTH
      estates = await db
        .select({
          id: estate.id,
          category: estate.category,
          usableArea: estate.usableArea,
          operationType: estate.operationType,
          price: estate.price,
          street: estate.street,
          city: estate.city,
        })
        .from(estate)
        .where(where.length ? and(...where) : undefined);
    }

    //
    // ============================
    // SELECT MEDIA
    // ============================
    //

    const ids = estates.map((e) => e.id);

    const media = ids.length
      ? await db
          .select({
            id: estateMedia.id,
            estateId: estateMedia.estateId,
            url: estateMedia.url,
            isMain: estateMedia.isMain,
          })
          .from(estateMedia)
          .where(inArray(estateMedia.estateId, ids))
      : [];

    //
    // ============================
    // MERGE RESULTS
    // ============================
    //

    return estates.map((e) => {
      const mainImage =
        media.find((m) => m.estateId === e.id && m.isMain)?.url ??
        media.find((m) => m.estateId === e.id)?.url ??
        null;

      return {
        id: e.id,
        property_type: e.category,
        usable_area: e.usableArea,
        offer_type: e.operationType,
        price: Number(e.price),
        address: `${e.street}, ${e.city}`,
        image: mainImage,
      };
    });
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    throw new Error("Failed to search estates");
  }
}
