"use server";
import { vicinityTypeEnum } from "@/db/schema";
import { haversineDistance } from "@/utils/haversineDistance";

export type OSMElement = {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
};

export type OverpassAPIResponse = {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OSMElement[];
};

export type Place = {
  type: VicinityType;
  name: string;
  latitude: number;
  longitude: number;
  id: number;
  distanceM: number;
};

const VICINITY_TYPES = [
  { osmKey: "highway", osmValue: "bus_stop", type: "Bus stop" },
  { osmKey: "amenity", osmValue: "post_office", type: "Post office" },
  { osmKey: "amenity", osmValue: "atm", type: "ATM" },
  { osmKey: "amenity", osmValue: "restaurant", type: "Restaurant / Pub" },
  { osmKey: "amenity", osmValue: "school", type: "School" },
  { osmKey: "amenity", osmValue: "kindergarten", type: "Kindergarten" },
  { osmKey: "amenity", osmValue: "clinic", type: "Clinic" },
  { osmKey: "amenity", osmValue: "veterinary", type: "Veterinarian" },
  { osmKey: "shop", osmValue: "supermarket", type: "Supermarket" },
  { osmKey: "shop", osmValue: "convenience", type: "Small shop" },
  { osmKey: "leisure", osmValue: "playground", type: "Children's playground" },
  { osmKey: "railway", osmValue: "station", type: "Train station" },
  { osmKey: "railway", osmValue: "subway_entrance", type: "Metro" },
];

export type VicinityType = (typeof vicinityTypeEnum.enumValues)[number];

export async function fetchVicinity(
  lat: number,
  lon: number,
  radius: number = 10000,
): Promise<{
  ok: boolean;
  data?: Record<VicinityType, Place[]>;
  message?: string;
}> {
  try {
    if (!lat || !lon || !radius) {
      throw new Error("Latitude and longitude are required.");
    }

    const queries = VICINITY_TYPES.map(
      ({ osmKey, osmValue }) =>
        `node[${osmKey}=${osmValue}](around:${radius},${lat},${lon});`,
    ).join("\n");

    const overpassQuery = `
    [out:json];
    (
      ${queries}
    );
    out body;
  `;
    console.log(overpassQuery);

    const apiUrl = "https://overpass-api.de/api/interpreter";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (!response.ok) {
      throw new Error(
        `Overpass API returned an error: ${response.status} ${response.statusText}`,
      );
    }

    const data: OverpassAPIResponse = await response.json();

    const mappedElements = (data.elements || [])
      .map((el) => {
        const typeEntry = VICINITY_TYPES.find(
          (v) => v.osmKey in el.tags && el.tags[v.osmKey] === v.osmValue,
        );

        const type = typeEntry?.type || "Unknown";
        const name = el.tags?.name?.trim() || type;

        return {
          type,
          name,
          latitude: el.lat,
          longitude: el.lon,
          id: el.id,
          distanceM: parseFloat(
            haversineDistance(lat, lon, el.lat, el.lon).toFixed(0),
          ),
        };
      })
      .filter((el): el is Place => Boolean(el));

    const sortedPlacesInGroups: Record<VicinityType, Place[]> =
      getSortedPlacesInGroups(groupPlaces(mappedElements));
    const groupClosest = {
      Closest: getClosestPlacesFromEachGroup(sortedPlacesInGroups),
    };

    return { ok: true, data: { ...sortedPlacesInGroups, ...groupClosest } };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "Unexpected Error" };
  }
}

function groupPlaces(places: Place[]) {
  const groups: Record<string, Place[]> = {};
  for (const place of places) {
    if (!groups[place.type]) {
      groups[place.type] = [];
    }
    groups[place.type].push(place);
  }
  return groups;
}

function getSortedPlacesInGroups(groups: Record<string, Place[]>) {
  const sortedGroups: Record<string, Place[]> = {};
  for (const [type, places] of Object.entries(groups)) {
    sortedGroups[type] = [...places].sort(
      (a: Place, b: Place) => a.distanceM - b.distanceM,
    );
  }
  return sortedGroups;
}

function getClosestPlacesFromEachGroup(groups: Record<string, Place[]>) {
  const closestPlaces: Place[] = [];
  for (const [, places] of Object.entries(groups)) {
    closestPlaces.push(
      places.reduce((prev: Place, cur: Place) =>
        cur.distanceM < prev.distanceM ? cur : prev,
      ),
    );
  }
  return closestPlaces;
}
