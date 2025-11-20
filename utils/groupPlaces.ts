import { VicinityType } from "@/db/schema";

export type Place = {
  type: VicinityType;
  name: string;
  latitude: number;
  longitude: number;
  id: number;
  distanceM: number;
};

export function groupPlaces(
  places: Place[],
): Partial<Record<VicinityType, Place[]>> {
  const groups: Partial<Record<VicinityType, Place[]>> = {};

  for (const place of places) {
    const type = place.type as VicinityType;

    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type]!.push(place);
  }

  return groups;
}
