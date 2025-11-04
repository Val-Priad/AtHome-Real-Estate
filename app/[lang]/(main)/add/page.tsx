"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ReadyDatePicker } from "./components/DatePicker";
import { AiDescriptionTabs } from "@/app/AiPage";

export type EstateFormData = {
  estate: {
    category: string;
    operationType: string;
    buildingCondition: string;
    energyClass: string;
    usableArea?: number;
    totalFloorArea?: number;
    roadType: string;
    furnished: string;
    easyAccess: boolean;
    readyDate?: Date;
    advertLifetime: string;
    price: number;
    currency: string;
    priceUnit: string;
    costOfLiving?: number;
    commission?: number;
    commissionPaidByOwner?: boolean;
    refundableDeposit?: number;
    city: string;
    street: string;
    regionCode: string;
    latitude: number;
    longitude: number;
  };

  estateApartment?: {
    flatClass?: string;
    buildingType?: string;
    advertSubtype?: string;
    floorNumber?: number;
    apartmentNumber?: string;
    garden: boolean;
    parking: boolean;
    elevator: boolean;
    balconyArea?: number;
    loggiaArea?: number;
    terraceArea?: number;
  };

  estateHouse?: {
    houseCategory?: string;
    roomCount?: string;
    houseType?: string;
    reconstructionYear?: number;
    acceptanceYear?: number;
    floors?: number;
    undergroundFloors?: number;
    parkingLotsCount?: number;
    gardenArea?: number;
    buildingArea?: number;
    circuitBreaker?: string;
    phase?: string;
    pool: boolean;
    cellar: boolean;
    garage: boolean;
    pvPanels: boolean;
    solarWaterHeating: boolean;
  };

  descriptions: {
    ua: string;
    en: string;
  };

  titles: {
    ua: string;
    en: string;
  };

  estateMedia: { url: string; type: "image" | "video" }[];

  estateHeatingSource?: string[];
  estateHeatingElement?: string[];
  estateWaterHeating?: string[];
  estateWater?: string[];
  estateElectricity?: string[];
  estateTelecommunication?: string[];
  estateInternet?: string[];
};

function Page() {
  const [formData, setFormData] = useState<EstateFormData>({
    estate: {
      category: "",
      operationType: "",
      buildingCondition: "",
      energyClass: "",
      roadType: "",
      furnished: "",
      easyAccess: false,
      advertLifetime: "",
      price: 0,
      currency: "EUR",
      priceUnit: "total",
      city: "",
      street: "",
      regionCode: "",
      latitude: 0,
      longitude: 0,
    },
    descriptions: { ua: "", en: "" },
    titles: { ua: "", en: "" },
    estateMedia: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(path: string, value: any) {
    setFormData((prev) => {
      const keys = path.split(".");
      const updated = { ...prev };

      let obj: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }

      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form Data:", formData);
  }

  return (
    <main className="flex justify-center px-2">
      <form
        className="border-brand-6 w-full max-w-3xl space-y-4 rounded-t-2xl border bg-stone-100 px-4 py-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-brand-10 text-center text-xl font-semibold">
          Create an Estate Advert
        </h1>

        <section className="flex flex-col gap-3">
          <h2 className="mb-2 text-lg font-semibold">Basic Information</h2>

          <div>
            <Label htmlFor="category">Estate category</Label>
            <Select
              name="category"
              value={formData.estate.category || ""}
              onValueChange={(v) => handleChange("estate.category", v)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="operationType">Operation type</Label>
            <Select
              name="operationType"
              value={formData.estate.operationType || ""}
              onValueChange={(v) => handleChange("estate.operationType", v)}
            >
              <SelectTrigger id="operationType">
                <SelectValue placeholder="Select operation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sale">Sale</SelectItem>
                <SelectItem value="Lease">Lease</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="buildingCondition">Building condition</Label>
            <Select
              name="buildingCondition"
              value={formData.estate.buildingCondition || ""}
              onValueChange={(v) => handleChange("estate.buildingCondition", v)}
            >
              <SelectTrigger id="buildingCondition">
                <SelectValue placeholder="Select building condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Very good">Very good</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
                <SelectItem value="Under construction">
                  Under construction
                </SelectItem>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="New building">New building</SelectItem>
                <SelectItem value="For demolition">For demolition</SelectItem>
                <SelectItem value="Before reconstruction">
                  Before reconstruction
                </SelectItem>
                <SelectItem value="After reconstruction">
                  After reconstruction
                </SelectItem>
                <SelectItem value="Under reconstruction">
                  Under reconstruction
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.estate.category === "House" && (
            <>
              <div>
                <Label htmlFor="reconstructionYear">Reconstruction Year</Label>
                <Input
                  name="reconstructionYear"
                  type="number"
                  step="1"
                  min={0}
                  value={formData.estateHouse?.reconstructionYear || ""}
                  onChange={(e) =>
                    handleChange(
                      "estateHouse.reconstructionYear",
                      e.target.value,
                    )
                  }
                  className={errors.reconstructionYear ? "border-red-500" : ""}
                />
                {errors.reconstructionYear && (
                  <p className="text-sm text-red-500">
                    {errors.reconstructionYear}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="acceptanceYear">Acceptance Year</Label>
                <Input
                  name="acceptanceYear"
                  type="number"
                  step="1"
                  min={0}
                  value={formData.estateHouse?.acceptanceYear || ""}
                  onChange={(e) =>
                    handleChange("estateHouse.acceptanceYear", e.target.value)
                  }
                  className={errors.acceptanceYear ? "border-red-500" : ""}
                />
                {errors.acceptanceYear && (
                  <p className="text-sm text-red-500">
                    {errors.acceptanceYear}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="houseCategory">House Category</Label>
                <Select
                  name="houseCategory"
                  value={formData.estateHouse?.houseCategory || ""}
                  onValueChange={(v) =>
                    handleChange("estateHouse.houseCategory", v)
                  }
                >
                  <SelectTrigger id="houseCategory">
                    <SelectValue placeholder="Select house category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cottage">Cottage</SelectItem>
                    <SelectItem value="Monument/Other">
                      Monument/Other
                    </SelectItem>
                    <SelectItem value="Family house">Family house</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Turnkey">Turnkey</SelectItem>
                    <SelectItem value="Country house">Country house</SelectItem>
                    <SelectItem value="Farmstead">Farmstead</SelectItem>
                    <SelectItem value="Multi-generational house">
                      Multi-generational house
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="roomCount">Room Count</Label>
                <Select
                  name="roomCount"
                  value={formData.estateHouse?.roomCount || ""}
                  onValueChange={(v) =>
                    handleChange("estateHouse.roomCount", v)
                  }
                >
                  <SelectTrigger id="roomCount">
                    <SelectValue placeholder="Select room count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5+">5+</SelectItem>
                    <SelectItem value="Atypical">Atypical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="houseType">House Type</Label>
                <Select
                  name="houseType"
                  value={formData.estateHouse?.houseType || ""}
                  onValueChange={(v) =>
                    handleChange("estateHouse.houseType", v)
                  }
                >
                  <SelectTrigger id="houseType">
                    <SelectValue placeholder="Select house type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Detached">Detached</SelectItem>
                    <SelectItem value="Semi-detached">Semi-detached</SelectItem>
                    <SelectItem value="Terraced">Terraced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {formData.estate.category === "Apartment" && (
            <>
              <div>
                <Label htmlFor="flatClass">Flat Class</Label>
                <Select
                  name="flatClass"
                  value={formData.estateApartment?.flatClass || ""}
                  onValueChange={(v) =>
                    handleChange("estateApartment.flatClass", v)
                  }
                >
                  <SelectTrigger id="flatClass">
                    <SelectValue placeholder="Select flat class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maisonette">Maisonette</SelectItem>
                    <SelectItem value="Loft">Loft</SelectItem>
                    <SelectItem value="Attic">Attic</SelectItem>
                    <SelectItem value="Single-story">Single-story</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="buildingType">Building Type</Label>
                <Select
                  name="buildingType"
                  value={formData.estateApartment?.buildingType || ""}
                  onValueChange={(v) =>
                    handleChange("estateApartment.buildingType", v)
                  }
                >
                  <SelectTrigger id="buildingType">
                    <SelectValue placeholder="Select building type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Panel">Panel</SelectItem>
                    <SelectItem value="Brick">Brick</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="advertSubtype">Advert Subtype</Label>
                <Select
                  name="advertSubtype"
                  value={formData.estateApartment?.advertSubtype || ""}
                  onValueChange={(v) =>
                    handleChange("estateApartment.advertSubtype", v)
                  }
                >
                  <SelectTrigger id="advertSubtype">
                    <SelectValue placeholder="Select advert subtype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 studio">1 studio</SelectItem>
                    <SelectItem value="1+1">1+1</SelectItem>
                    <SelectItem value="2 studio">2 studio</SelectItem>
                    <SelectItem value="2+1">2+1</SelectItem>
                    <SelectItem value="3 studio">3 studio</SelectItem>
                    <SelectItem value="3+1">3+1</SelectItem>
                    <SelectItem value="4 studio">4 studio</SelectItem>
                    <SelectItem value="4+1">4+1</SelectItem>
                    <SelectItem value="5 studio">5 studio</SelectItem>
                    <SelectItem value="5+1">5+1</SelectItem>
                    <SelectItem value="6 or more">6 or more</SelectItem>
                    <SelectItem value="Atypical">Atypical</SelectItem>
                    <SelectItem value="Room">Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="energyClass">Energy Class</Label>
            <Select
              name="energyClass"
              value={formData.estate.energyClass || ""}
              onValueChange={(v) => handleChange("estate.energyClass", v)}
            >
              <SelectTrigger id="energyClass">
                <SelectValue placeholder="Select energy class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
                <SelectItem value="F">F</SelectItem>
                <SelectItem value="G">G</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="usableArea">Usable Area (m²)</Label>
            <Input
              name="usableArea"
              type="number"
              step="any"
              value={formData.estate.usableArea || ""}
              onChange={(e) =>
                handleChange("estate.usableArea", e.target.value)
              }
              className={errors.usableArea ? "border-red-500" : ""}
            />
            {errors.usableArea && (
              <p className="text-sm text-red-500">{errors.usableArea}</p>
            )}
          </div>

          <div>
            <Label htmlFor="totalFloorArea">Total Floor Area (m²)</Label>
            <Input
              name="totalFloorArea"
              type="number"
              step="any"
              value={formData.estate.totalFloorArea || ""}
              onChange={(e) =>
                handleChange("estate.totalFloorArea", e.target.value)
              }
              className={errors.totalFloorArea ? "border-red-500" : ""}
            />
            {errors.totalFloorArea && (
              <p className="text-sm text-red-500">{errors.totalFloorArea}</p>
            )}
          </div>

          {formData.estate.category === "House" && (
            <>
              <div>
                <Label htmlFor="gardenArea">Garden Area (m²)</Label>
                <Input
                  name="gardenArea"
                  type="number"
                  step="any"
                  min={0}
                  value={formData.estateHouse?.gardenArea || ""}
                  onChange={(e) =>
                    handleChange("estateHouse.gardenArea", e.target.value)
                  }
                  className={errors.gardenArea ? "border-red-500" : ""}
                />
                {errors.gardenArea && (
                  <p className="text-sm text-red-500">{errors.gardenArea}</p>
                )}
              </div>

              <div>
                <Label htmlFor="buildingArea">Building Area (m²)</Label>
                <Input
                  name="buildingArea"
                  type="number"
                  step="any"
                  min={0}
                  value={formData.estateHouse?.buildingArea || ""}
                  onChange={(e) =>
                    handleChange("estateHouse.buildingArea", e.target.value)
                  }
                  className={errors.buildingArea ? "border-red-500" : ""}
                />
                {errors.buildingArea && (
                  <p className="text-sm text-red-500">{errors.buildingArea}</p>
                )}
              </div>
            </>
          )}

          {formData.estate.category === "Apartment" && (
            <>
              {/* Balcony Area */}
              <div>
                <Label htmlFor="balconyArea">Balcony Area (m²)</Label>
                <Input
                  name="balconyArea"
                  type="number"
                  step="any"
                  value={formData.estateApartment?.balconyArea || ""}
                  onChange={(e) =>
                    handleChange("estateApartment.balconyArea", e.target.value)
                  }
                  className={errors.balconyArea ? "border-red-500" : ""}
                />
                {errors.balconyArea && (
                  <p className="text-sm text-red-500">{errors.balconyArea}</p>
                )}
              </div>

              {/* Loggia Area */}
              <div>
                <Label htmlFor="loggiaArea">Loggia Area (m²)</Label>
                <Input
                  name="loggiaArea"
                  type="number"
                  step="any"
                  value={formData.estateApartment?.loggiaArea || ""}
                  onChange={(e) =>
                    handleChange("estateApartment.loggiaArea", e.target.value)
                  }
                  className={errors.loggiaArea ? "border-red-500" : ""}
                />
                {errors.loggiaArea && (
                  <p className="text-sm text-red-500">{errors.loggiaArea}</p>
                )}
              </div>

              {/* Terrace Area */}
              <div>
                <Label htmlFor="terraceArea">Terrace Area (m²)</Label>
                <Input
                  name="terraceArea"
                  type="number"
                  step="any"
                  value={formData.estateApartment?.terraceArea || ""}
                  onChange={(e) =>
                    handleChange("estateApartment.terraceArea", e.target.value)
                  }
                  className={errors.terraceArea ? "border-red-500" : ""}
                />
                {errors.terraceArea && (
                  <p className="text-sm text-red-500">{errors.terraceArea}</p>
                )}
              </div>
            </>
          )}

          <div>
            <Label htmlFor="roadType">Road Type</Label>
            <Select
              name="roadType"
              value={formData.estate.roadType || ""}
              onValueChange={(v) => handleChange("estate.roadType", v)}
            >
              <SelectTrigger id="roadType">
                <SelectValue placeholder="Select road type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asphalt">Asphalt</SelectItem>
                <SelectItem value="Gravel">Gravel</SelectItem>
                <SelectItem value="No access road">No access road</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.estate.category === "House" && (
            <>
              <div>
                <Label htmlFor="floors">Floors</Label>
                <Input
                  name="floors"
                  type="number"
                  step="1"
                  min={0}
                  value={formData.estateHouse?.floors || ""}
                  onChange={(e) =>
                    handleChange("estateHouse.floors", e.target.value)
                  }
                  className={errors.floors ? "border-red-500" : ""}
                />
                {errors.floors && (
                  <p className="text-sm text-red-500">{errors.floors}</p>
                )}
              </div>

              <div>
                <Label htmlFor="undergroundFloors">Underground Floors</Label>
                <Input
                  name="undergroundFloors"
                  type="number"
                  step="1"
                  min={0}
                  value={formData.estateHouse?.undergroundFloors || ""}
                  onChange={(e) =>
                    handleChange(
                      "estateHouse.undergroundFloors",
                      e.target.value,
                    )
                  }
                  className={errors.undergroundFloors ? "border-red-500" : ""}
                />
                {errors.undergroundFloors && (
                  <p className="text-sm text-red-500">
                    {errors.undergroundFloors}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="parkingLotsCount">Parking Lots Count</Label>
                <Input
                  name="parkingLotsCount"
                  type="number"
                  step="1"
                  min={0}
                  value={formData.estateHouse?.parkingLotsCount || ""}
                  onChange={(e) =>
                    handleChange("estateHouse.parkingLotsCount", e.target.value)
                  }
                  className={errors.parkingLotsCount ? "border-red-500" : ""}
                />
                {errors.parkingLotsCount && (
                  <p className="text-sm text-red-500">
                    {errors.parkingLotsCount}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="circuitBreaker">Circuit Breaker</Label>
                <Select
                  name="circuitBreaker"
                  value={formData.estateHouse?.circuitBreaker || ""}
                  onValueChange={(v) =>
                    handleChange("estateHouse.circuitBreaker", v)
                  }
                >
                  <SelectTrigger id="circuitBreaker">
                    <SelectValue placeholder="Select circuit breaker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20A">20A</SelectItem>
                    <SelectItem value="25A">25A</SelectItem>
                    <SelectItem value="32A">32A</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phase">Phase</Label>
                <Select
                  name="phase"
                  value={formData.estateHouse?.phase || ""}
                  onValueChange={(v) => handleChange("estateHouse.phase", v)}
                >
                  <SelectTrigger id="phase">
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single-phase">Single-phase</SelectItem>
                    <SelectItem value="Three-phase">Three-phase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="furnished">Furnished</Label>
            <Select
              name="furnished"
              value={formData.estate.furnished || ""}
              onValueChange={(v) => handleChange("estate.furnished", v)}
            >
              <SelectTrigger id="furnished">
                <SelectValue placeholder="Select furnishing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Partially">Partially</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="easyAccess">Easy Access</Label>
            <Checkbox
              id="easyAccess"
              checked={!!formData.estate.easyAccess}
              onCheckedChange={(checked) =>
                handleChange("estate.easyAccess", checked)
              }
            />
          </div>

          {formData.estate.category === "House" && (
            <>
              <div>
                <Label htmlFor="pool">Pool</Label>
                <Checkbox
                  id="pool"
                  checked={!!formData.estateHouse?.pool}
                  onCheckedChange={(checked) =>
                    handleChange("estateHouse.pool", checked)
                  }
                />
              </div>

              <div>
                <Label htmlFor="cellar">Cellar</Label>
                <Checkbox
                  id="cellar"
                  checked={!!formData.estateHouse?.cellar}
                  onCheckedChange={(checked) =>
                    handleChange("estateHouse.cellar", checked)
                  }
                />
              </div>

              <div>
                <Label htmlFor="garage">Garage</Label>
                <Checkbox
                  id="garage"
                  checked={!!formData.estateHouse?.garage}
                  onCheckedChange={(checked) =>
                    handleChange("estateHouse.garage", checked)
                  }
                />
              </div>

              <div>
                <Label htmlFor="pvPanels">PV Panels</Label>
                <Checkbox
                  id="pvPanels"
                  checked={!!formData.estateHouse?.pvPanels}
                  onCheckedChange={(checked) =>
                    handleChange("estateHouse.pvPanels", checked)
                  }
                />
              </div>

              <div>
                <Label htmlFor="solarWaterHeating">Solar Water Heating</Label>
                <Checkbox
                  id="solarWaterHeating"
                  checked={!!formData.estateHouse?.solarWaterHeating}
                  onCheckedChange={(checked) =>
                    handleChange("estateHouse.solarWaterHeating", checked)
                  }
                />
              </div>
            </>
          )}

          {formData.estate.category === "Apartment" && (
            <>
              <div>
                <Label htmlFor="garden">Garden</Label>
                <Checkbox
                  id="garden"
                  checked={!!formData.estateApartment?.garden}
                  onCheckedChange={(checked) =>
                    handleChange("estateApartment.garden", checked)
                  }
                />
              </div>

              <div>
                <Label htmlFor="parking">Parking</Label>
                <Checkbox
                  id="parking"
                  checked={!!formData.estateApartment?.parking}
                  onCheckedChange={(checked) =>
                    handleChange("estateApartment.parking", checked)
                  }
                />
              </div>

              <div>
                <Label htmlFor="elevator">Elevator</Label>
                <Checkbox
                  id="elevator"
                  checked={!!formData.estateApartment?.elevator}
                  onCheckedChange={(checked) =>
                    handleChange("estateApartment.elevator", checked)
                  }
                />
              </div>
            </>
          )}

          <div>
            <ReadyDatePicker
              value={formData.estate.readyDate}
              onChange={(date) => handleChange("estate.readyDate", date)}
            />
          </div>

          <div>
            <Label htmlFor="advertLifetime">Advert Lifetime (days)</Label>
            <Select
              name="advertLifetime"
              value={formData.estate.advertLifetime || ""}
              onValueChange={(v) => handleChange("estate.advertLifetime", v)}
            >
              <SelectTrigger id="advertLifetime">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Week</SelectItem>
                <SelectItem value="30">Month</SelectItem>
                <SelectItem value="90">3 month</SelectItem>
                <SelectItem value="180">6 month</SelectItem>
                <SelectItem value="365">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                name="price"
                type="number"
                value={formData.estate.price || ""}
                onChange={(e) => handleChange("estate.price", e.target.value)}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-sm text-red-500">Price must be positive</p>
              )}
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                name="currency"
                value={formData.estate.currency || ""}
                onValueChange={(v) => handleChange("estate.currency", v)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priceUnit">Price Unit</Label>
              <Select
                name="priceUnit"
                value={formData.estate.priceUnit || ""}
                onValueChange={(v) => handleChange("estate.priceUnit", v)}
              >
                <SelectTrigger id="priceUnit">
                  <SelectValue placeholder="Select price unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_property">per property</SelectItem>
                  <SelectItem value="per_month">per month</SelectItem>
                  <SelectItem value="per_night">per night</SelectItem>
                  <SelectItem value="per_m2">per m²</SelectItem>
                  <SelectItem value="per_m2_per_month">
                    per m² per month
                  </SelectItem>
                  <SelectItem value="per_m2_per_day">per m² per day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="costOfLiving">Cost of Living</Label>
              <Input
                name="costOfLiving"
                type="number"
                step="any"
                min={0}
                value={formData.estate.costOfLiving || ""}
                onChange={(e) =>
                  handleChange("estate.costOfLiving", e.target.value)
                }
                className={errors.costOfLiving ? "border-red-500" : ""}
              />
              {errors.costOfLiving && (
                <p className="text-sm text-red-500">
                  Cost of living must be positive
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="commission">Commission</Label>
              <Input
                name="commission"
                type="number"
                step="any"
                min={0}
                value={formData.estate.commission || ""}
                onChange={(e) =>
                  handleChange("estate.commission", e.target.value)
                }
                className={errors.commission ? "border-red-500" : ""}
              />
              {errors.commission && (
                <p className="text-sm text-red-500">
                  Commission must be positive
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="commissionPaidByOwner">
                Commission is paid by owner
              </Label>
              <Checkbox
                id="commissionPaidByOwner"
                checked={!!formData.estate.commissionPaidByOwner}
                onCheckedChange={(checked) =>
                  handleChange("estate.commissionPaidByOwner", checked)
                }
              />
            </div>

            <div>
              <Label htmlFor="refundableDeposit">Refundable Deposit</Label>
              <Input
                name="refundableDeposit"
                type="number"
                step="any"
                min={0}
                value={formData.estate.refundableDeposit || ""}
                onChange={(e) =>
                  handleChange("estate.refundableDeposit", e.target.value)
                }
                className={errors.refundableDeposit ? "border-red-500" : ""}
              />
              {errors.refundableDeposit && (
                <p className="text-sm text-red-500">
                  Refundable deposit must be positive
                </p>
              )}
            </div>

            {formData.estate.category === "Apartment" && (
              <>
                <div>
                  <Label htmlFor="floorNumber">Floor Number</Label>
                  <Input
                    name="floorNumber"
                    type="number"
                    value={formData.estateApartment?.floorNumber || ""}
                    onChange={(e) =>
                      handleChange(
                        "estateApartment.floorNumber",
                        e.target.value,
                      )
                    }
                    className={errors.floorNumber ? "border-red-500" : ""}
                  />
                  {errors.floorNumber && (
                    <p className="text-sm text-red-500">
                      Floor number must be a positive integer
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="apartmentNumber">Apartment Number</Label>
                  <Input
                    name="apartmentNumber"
                    type="text"
                    value={formData.estateApartment?.apartmentNumber || ""}
                    onChange={(e) =>
                      handleChange(
                        "estateApartment.apartmentNumber",
                        e.target.value,
                      )
                    }
                    className={errors.apartmentNumber ? "border-red-500" : ""}
                  />
                  {errors.apartmentNumber && (
                    <p className="text-sm text-red-500">
                      Apartment number is required
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                name="city"
                type="text"
                value={formData.estate.city || ""}
                onChange={(e) => handleChange("estate.city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500">City is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="street">Street</Label>
              <Input
                name="street"
                type="text"
                value={formData.estate.street || ""}
                onChange={(e) => handleChange("estate.street", e.target.value)}
                className={errors.street ? "border-red-500" : ""}
              />
              {errors.street && (
                <p className="text-sm text-red-500">Street is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Select
                name="region"
                value={formData.estate.regionCode || ""}
                onValueChange={(v) => handleChange("estate.regionCode", v)}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UA-05">Vinnytsia</SelectItem>
                  <SelectItem value="UA-07">Volyn</SelectItem>
                  <SelectItem value="UA-12">Dnipropetrovsk</SelectItem>
                  <SelectItem value="UA-14">Donetsk</SelectItem>
                  <SelectItem value="UA-18">Zhytomyr</SelectItem>
                  <SelectItem value="UA-21">Zakarpattia</SelectItem>
                  <SelectItem value="UA-23">Zaporizhzhia</SelectItem>
                  <SelectItem value="UA-26">Ivano-Frankivsk</SelectItem>
                  <SelectItem value="UA-32">Kyiv Region</SelectItem>
                  <SelectItem value="UA-35">Kirovohrad</SelectItem>
                  <SelectItem value="UA-46">Lviv</SelectItem>
                  <SelectItem value="UA-48">Mykolaiv</SelectItem>
                  <SelectItem value="UA-51">Odesa</SelectItem>
                  <SelectItem value="UA-53">Poltava</SelectItem>
                  <SelectItem value="UA-56">Rivne</SelectItem>
                  <SelectItem value="UA-59">Sumy</SelectItem>
                  <SelectItem value="UA-61">Ternopil</SelectItem>
                  <SelectItem value="UA-63">Kharkiv</SelectItem>
                  <SelectItem value="UA-65">Kherson</SelectItem>
                  <SelectItem value="UA-68">Khmelnytskyi</SelectItem>
                  <SelectItem value="UA-71">Cherkasy</SelectItem>
                  <SelectItem value="UA-74">Chernihiv</SelectItem>
                  <SelectItem value="UA-77">Chernivtsi</SelectItem>
                  <SelectItem value="UA-43">Crimea</SelectItem>
                  <SelectItem value="UA-30">Kyiv City</SelectItem>
                  <SelectItem value="UA-40">Sevastopol</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                name="latitude"
                type="number"
                step="any"
                value={formData.estate.latitude || ""}
                onChange={(e) =>
                  handleChange("estate.latitude", e.target.value)
                }
                className={errors.latitude ? "border-red-500" : ""}
              />
              {errors.latitude && (
                <p className="text-sm text-red-500">Latitude is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                name="longitude"
                type="number"
                step="any"
                value={formData.estate.longitude || ""}
                onChange={(e) =>
                  handleChange("estate.longitude", e.target.value)
                }
                className={errors.longitude ? "border-red-500" : ""}
              />
              {errors.longitude && (
                <p className="text-sm text-red-500">Longitude is required</p>
              )}
            </div>
          </div>
          {/* <AiDescriptionTabs /> */}
        </section>
      </form>
    </main>
  );
}

export default Page;
