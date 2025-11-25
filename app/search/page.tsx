"use client";
import { useEffect, useState } from "react";
import CheckboxGroup, { CheckboxOption } from "./components/CheckboxGroup";
import {
  apartmentPlanEnum,
  buildingConditionEnum,
  buildingTypeEnum,
  flatClassEnum,
  houseCategoryEnum,
  houseTypeEnum,
  internetConnectionEnum,
  operationTypeEnum,
  regionEnum,
  roomCountEnum,
  vicinityTypeEnum,
  waterHeatSourceEnum,
} from "@/db/schema";
import EstateTypeChoose from "./components/estateTypeChoose";
import Map from "./components/Map";

import { z } from "zod";
import RangeGroup from "./components/RangeGroup";
import { DistanceSelect } from "./components/DistanceToFacilities";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import {
  ApartmentPlanEnum,
  BuildingMaterialEnum,
  ConditionEnum,
  EnergyClassEnum,
  FacilityEnum,
  FlatClassEnum,
  HouseCategoryEnum,
  HousePlanEnum,
  HouseTypeEnum,
  InternetConnectionEnum,
  OfferTypeEnum,
  RegionEnum,
  WaterHeatEnum,
} from "@/db/types";
import { useRouter, useSearchParams } from "next/navigation";

const optionalNumber = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .refine(
    (v) => v === undefined || /^-?\d+(\.\d+)?$/.test(v),
    "Value must be a valid number",
  )
  .transform((v) => (v === undefined ? undefined : Number(v)));

const searchSchema = z.object({
  distanceToFacilities: z.enum(["0.5", "1", "1.5", "2", "5", "10"]).optional(),

  usableAreaFrom: optionalNumber,
  usableAreaTo: optionalNumber,

  priceFrom: optionalNumber,
  priceTo: optionalNumber,
});

export type CheckboxStateType = {
  estate: {
    region: RegionEnum[];
    offerType: OfferTypeEnum[];
    condition: ConditionEnum[];
    energyClass: EnergyClassEnum[];
    accessories: string[];
  };
  estateApartment: {
    flatClass: FlatClassEnum[];
    buildingType: BuildingMaterialEnum[];
    apartmentPlan: ApartmentPlanEnum[];
    accessories: string[];
  };
  estateHouse: {
    houseCategory: HouseCategoryEnum[];
    housePlan: HousePlanEnum[];
    houseType: HouseTypeEnum[];
    accessories: string[];
  };
  multiselect: {
    waterHeatSource: WaterHeatEnum[];
    internetConnections: InternetConnectionEnum[];
  };
  vicinity: {
    facilitiesNearby: FacilityEnum[];
  };
};

export type InputStateType = {
  aiSearch?: string;
  distanceToFacilities?: string;

  usableAreaFrom?: number;
  usableAreaTo?: number;

  priceFrom?: number;
  priceTo?: number;
};

export type InputUIStateType = {
  aiSearch: string;
  distanceToFacilities: string;

  usableAreaFrom: string;
  usableAreaTo: string;

  priceFrom: string;
  priceTo: string;
};

type SettingsType = {
  path: string;
  label: string;
  options: CheckboxOption[];
  fieldValue: string[];
};

const INITIAL_CHECKBOX_STATE: CheckboxStateType = {
  estate: {
    region: [],
    offerType: [],
    condition: [],
    energyClass: [],
    accessories: [],
  },
  estateApartment: {
    flatClass: [],
    buildingType: [],
    apartmentPlan: [],
    accessories: [],
  },
  estateHouse: {
    houseCategory: [],
    housePlan: [],
    houseType: [],
    accessories: [],
  },
  multiselect: {
    waterHeatSource: [],
    internetConnections: [],
  },
  vicinity: {
    facilitiesNearby: [],
  },
};

const INITIAL_INPUT_STATE = {
  aiSearch: "",
  distanceToFacilities: "0.5",
  floorFrom: "",
  floorTo: "",
  usableAreaFrom: "",
  usableAreaTo: "",
  landAreaFrom: "",
  landAreaTo: "",
  priceFrom: "",
  priceTo: "",
};

function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [estateType, setEstateType] = useState<"apartment" | "house" | null>(
    null,
  );
  const [checkboxState, setCheckboxState] = useState<CheckboxStateType>(
    INITIAL_CHECKBOX_STATE,
  );
  const [inputState, setInputState] = useState(INITIAL_INPUT_STATE);

  useEffect(() => {
    restoreStateFromParams(params);
  }, [params]);

  function restoreStateFromParams(params: URLSearchParams) {
    const restoredCheckbox: CheckboxStateType = JSON.parse(
      JSON.stringify(INITIAL_CHECKBOX_STATE),
    );
    const restoredInput: typeof INITIAL_INPUT_STATE = JSON.parse(
      JSON.stringify(INITIAL_INPUT_STATE),
    );

    for (const [key, value] of params.entries()) {
      if (key.includes(".")) {
        const [section, inner] = key.split(".");

        const sec = section as keyof CheckboxStateType;
        const innerKey = inner as keyof CheckboxStateType[typeof sec];

        const targetArray = restoredCheckbox[sec][innerKey] as
          | string[]
          | undefined;

        if (!targetArray) {
          (restoredCheckbox[sec][innerKey] as string[]) = [value];
        } else {
          targetArray.push(value);
        }

        continue;
      }

      if (key in restoredInput) {
        restoredInput[key as keyof typeof restoredInput] = value;
        continue;
      }

      if (key === "estateType") {
        setEstateType(value as "apartment" | "house" | null);
        continue;
      }
    }

    setCheckboxState(restoredCheckbox);
    setInputState(restoredInput);
  }

  function updateCheckbox(path: string, updated: string[]) {
    setCheckboxState((prev) => {
      const [section, key] = path.split(".");

      return {
        ...prev,
        [section]: {
          ...prev[section as keyof CheckboxStateType],
          [key]: updated,
        },
      };
    });
  }

  function updateInput(
    key: keyof typeof inputState,
    value: string | undefined,
  ) {
    setInputState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    setIsLoading(true);
    const dismiss = toast.loading("Searching...");
    try {
      const result = searchSchema.safeParse(inputState);

      if (!result.success) {
        toast.dismiss(dismiss);
        const flattened = result.error.flatten();
        const fieldErrors = flattened.fieldErrors;
        const formErrors = flattened.formErrors;

        const message = [
          ...formErrors,
          ...Object.entries(fieldErrors).flatMap(([field, msgs]) =>
            msgs.map((msg) => `${field}: ${msg}`),
          ),
        ].join("\n");

        toast.error("Validation error", {
          description: message || "Invalid form input",
        });

        return;
      }

      const validatedInputs = result.data;

      const payload = {
        ...validatedInputs,
        ...checkboxState,
        estateType,
      };

      const queryString = buildQueryFromPayload(payload);

      router.push(`/search/results?${queryString}`);

      toast.dismiss(dismiss);
      toast.success("Filters applied!");
    } catch (error) {
      toast.dismiss(dismiss);
      toast.error("Unexpected error", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }

    setIsLoading(false);
  }

  function buildQueryFromPayload(
    payload: InputStateType &
      CheckboxStateType & {
        estateType: "apartment" | "house" | null;
      },
  ) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined || value === null) continue;

      if (typeof value === "string" || typeof value === "number") {
        params.set(key, String(value));
        continue;
      }

      if (typeof value === "object" && !Array.isArray(value)) {
        for (const [innerKey, innerValue] of Object.entries(value)) {
          if (Array.isArray(innerValue)) {
            innerValue.forEach((v) => params.append(`${key}.${innerKey}`, v));
          }
        }
      }
    }

    return params.toString();
  }

  const generalAccessories = ["Furnished", "Easy Access"];
  const apartmentAccessories = [
    "Balcony",
    "Loggia",
    "Terrace",
    "Garden",
    "Parking",
    "Elevator",
  ];
  const houseAccessories = [
    "Parking",
    "Garden",
    "Multi-story",
    "Pool",
    "Cellar",
    "Garage",
  ];

  const generalCheckboxSettings: SettingsType[] = [
    {
      path: "estate.region",
      label: "Region",
      options: regionEnum.enumValues,
      fieldValue: checkboxState.estate.region,
    },
    {
      path: "estate.offerType",
      label: "Offer Type",
      options: operationTypeEnum.enumValues,
      fieldValue: checkboxState.estate.offerType,
    },
    {
      path: "estate.condition",
      label: "Condition",
      options: buildingConditionEnum.enumValues,
      fieldValue: checkboxState.estate.condition,
    },
    {
      path: "estate.energyClass",
      label: "Energy Consumption Classes",
      options: [
        { value: "A", label: "A - Most energy efficient" },
        { value: "B", label: "B - Very energy efficient" },
        { value: "C", label: "C - Energy efficient" },
        { value: "D", label: "D - Average energy efficiency" },
        { value: "E", label: "E - Low energy efficiency" },
        { value: "F", label: "F - Very low energy efficiency" },
        { value: "G", label: "G - Least energy efficient" },
      ],
      fieldValue: checkboxState.estate.energyClass,
    },
    {
      path: "estate.accessories",
      label: "Estate accessories",
      options: generalAccessories,
      fieldValue: checkboxState.estate.accessories,
    },
  ];
  const apartmentCheckboxSettings: SettingsType[] = [
    {
      path: "estateApartment.flatClass",
      label: "Flat Class",
      options: flatClassEnum.enumValues,
      fieldValue: checkboxState.estateApartment.flatClass,
    },
    {
      path: "estateApartment.buildingType",
      label: "Building Material",
      options: buildingTypeEnum.enumValues,
      fieldValue: checkboxState.estateApartment.buildingType,
    },
    {
      path: "estateApartment.apartmentPlan",
      label: "Apartment Plan",
      options: apartmentPlanEnum.enumValues,
      fieldValue: checkboxState.estateApartment.apartmentPlan,
    },
    {
      path: "estateApartment.accessories",
      label: "Apartment Accessories",
      options: apartmentAccessories,
      fieldValue: checkboxState.estateApartment.accessories,
    },
  ];
  const houseCheckboxSettings: SettingsType[] = [
    {
      path: "estateHouse.houseCategory",
      label: "House Category",
      options: houseCategoryEnum.enumValues,
      fieldValue: checkboxState.estateHouse.houseCategory,
    },
    {
      path: "estateHouse.housePlan",
      label: "House Plan",
      options: roomCountEnum.enumValues,
      fieldValue: checkboxState.estateHouse.housePlan,
    },
    {
      path: "estateHouse.houseType",
      label: "House Type",
      options: houseTypeEnum.enumValues,
      fieldValue: checkboxState.estateHouse.houseType,
    },
    {
      path: "estateHouse.accessories",
      label: "House Accessories",
      options: houseAccessories,
      fieldValue: checkboxState.estateHouse.accessories,
    },
  ];
  const multiselectCheckboxSettings: SettingsType[] = [
    {
      path: "multiselect.waterHeatSource",
      label: "Water Heating Source",
      options: waterHeatSourceEnum.enumValues,
      fieldValue: checkboxState.multiselect.waterHeatSource,
    },
    {
      path: "multiselect.internetConnections",
      label: "Internet Connection",
      options: internetConnectionEnum.enumValues,
      fieldValue: checkboxState.multiselect.internetConnections,
    },
  ];

  return (
    <main className="flex items-center justify-center">
      <div className="border-brand-6/50 m-3 flex max-w-228 flex-col gap-6 rounded-xl border-2 p-5">
        <Toaster richColors position="top-center" />
        <Map
          fieldValue={checkboxState.estate.region}
          onChange={(updated) => updateCheckbox("estate.region", updated)}
        />

        <EstateTypeChoose handleClick={setEstateType} estateType={estateType} />
        {generalCheckboxSettings.map((settings) => (
          <CheckboxGroup
            key={settings.label}
            label={settings.label}
            options={settings.options}
            fieldValue={settings.fieldValue}
            onChange={(updated) => updateCheckbox(settings.path, updated)}
          />
        ))}

        {estateType === "apartment" &&
          apartmentCheckboxSettings.map((settings) => (
            <CheckboxGroup
              key={settings.label}
              label={settings.label}
              options={settings.options}
              fieldValue={settings.fieldValue}
              onChange={(updated) => updateCheckbox(settings.path, updated)}
            />
          ))}

        {estateType === "house" &&
          houseCheckboxSettings.map((settings) => (
            <CheckboxGroup
              key={settings.label}
              label={settings.label}
              options={settings.options}
              fieldValue={settings.fieldValue}
              onChange={(updated) => updateCheckbox(settings.path, updated)}
            />
          ))}

        {multiselectCheckboxSettings.map((settings) => (
          <CheckboxGroup
            key={settings.label}
            label={settings.label}
            options={settings.options}
            fieldValue={settings.fieldValue}
            onChange={(updated) => updateCheckbox(settings.path, updated)}
          />
        ))}

        <DistanceSelect
          value={inputState.distanceToFacilities}
          onChange={(val) => updateInput("distanceToFacilities", val)}
        />

        <CheckboxGroup
          key="Facilities Nearby"
          label="Facilities Nearby"
          options={vicinityTypeEnum.enumValues.filter(
            (type) => type !== "Closest",
          )}
          fieldValue={checkboxState.vicinity.facilitiesNearby}
          onChange={(updated) =>
            updateCheckbox("vicinity.facilitiesNearby", updated)
          }
        />

        <RangeGroup
          label="Usable Area"
          fromKey="usableAreaFrom"
          toKey="usableAreaTo"
          state={inputState}
          onChange={updateInput}
        />

        <RangeGroup
          label="Price"
          fromKey="priceFrom"
          toKey="priceTo"
          state={inputState}
          onChange={updateInput}
        />

        <div>
          <Button
            className="w-1/2"
            variant="secondary"
            onClick={() => {
              setInputState(INITIAL_INPUT_STATE);
              setCheckboxState(INITIAL_CHECKBOX_STATE);
            }}
          >
            Clear
          </Button>
          <Button
            className="w-1/2"
            onClick={async () => await handleSubmit()}
            disabled={isLoading}
          >
            Search
          </Button>
        </div>
      </div>
    </main>
  );
}

export default Page;
