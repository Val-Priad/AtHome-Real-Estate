"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VicinityType } from "@/db/schema";

type Place = {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  distanceM: number;
  type: VicinityType;
};

export type Vicinity = Partial<Record<VicinityType, Place[]>>;

export default function VicinityTabs({
  vicinity,
  tabValue,
  onTabChange,
}: {
  vicinity?: Vicinity;
  tabValue: string;
  onTabChange: (value: string) => void;
}) {
  if (
    !vicinity ||
    !Object.values(vicinity).some(
      (places) => Array.isArray(places) && places.length > 0,
    )
  ) {
    return null;
  }

  const types = Object.keys(vicinity) as (keyof typeof vicinity)[];

  return (
    <Tabs value={tabValue} onValueChange={onTabChange}>
      <div className="overflow-x-scroll">
        <TabsList>
          {types.map((type) => (
            <TabsTrigger
              key={type}
              value={type as string}
              className="hover:bg-brand-2 transition-colors duration-300"
            >
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {types.map((type) => (
        <TabsContent key={type} value={type as string}>
          <div className="max-h-[200px] overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-3">
              {vicinity[type]?.map((place) => (
                <a
                  key={place.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}&zoom=19`}
                  className="border-border bg-card hover:bg-accent hover:text-accent-foreground block rounded-lg border p-2 transition-colors"
                >
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{place.name}</span>
                    <span className="text-brand-6 whitespace-nowrap">
                      {place.distanceM} m
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
