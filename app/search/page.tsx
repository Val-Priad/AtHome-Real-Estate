"use client";
import { useState } from "react";
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
import { AiSearchTextarea } from "./components/AiSearchTextArea";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { formatErrors } from "./components/formatErrors";

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
  aiSearch: z
    .string()
    .max(1000, "Ai search query is too long")
    .or(z.literal("").transform(() => undefined))
    .optional(),

  distanceToFacilities: z.enum(["0.5", "1", "1.5", "2", "5", "10"]).optional(),

  floorFrom: optionalNumber,
  floorTo: optionalNumber,

  usableAreaFrom: optionalNumber,
  usableAreaTo: optionalNumber,

  landAreaFrom: optionalNumber,
  landAreaTo: optionalNumber,

  priceFrom: optionalNumber,
  priceTo: optionalNumber,
});

type CheckboxStateType = {
  estate: {
    region: string[];
    offerType: string[];
    condition: string[];
    energyClass: string[];
    accessories: [];
  };
  estateApartment: {
    flatClass: string[];
    buildingMaterial: string[];
    apartmentPlan: string[];
    accessories: string[];
  };
  estateHouse: {
    houseCategory: string[];
    housePlan: string[];
    houseType: string[];
    accessories: string[];
  };
  multiselect: {
    waterHeatSource: string[];
    internetConnections: string[];
  };
  vicinity: {
    facilitiesNearby: string[];
  };
};

export type InputStateType = {
  aiSearch: string;
  distanceToFacilities: string;
  floorFrom: string;
  floorTo: string;
  usableAreaFrom: string;
  usableAreaTo: string;
  landAreaFrom: string;
  landAreaTo: string;
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
    buildingMaterial: [],
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
  const [isLoading, setIsLoading] = useState(false);
  const [estateType, setEstateType] = useState<"apartment" | "house" | null>(
    "apartment",
  );
  const [checkboxState, setCheckboxState] = useState<CheckboxStateType>(
    INITIAL_CHECKBOX_STATE,
  );
  const [inputState, setInputState] = useState(INITIAL_INPUT_STATE);

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

      console.log("FINAL PAYLOAD:", payload);

      await new Promise((r) => setTimeout(r, 1200));

      toast.dismiss(dismiss);

      toast.success("Filters applied!", {
        description: "Search results have been updated.",
      });
    } catch (error) {
      toast.dismiss(dismiss);

      if (error instanceof Error) {
        toast.error("Unexpected error", {
          description: error.message,
        });
      } else {
        toast.error("Unexpected error", {
          description: "Something went wrong.",
        });
      }
    }
    setIsLoading(false);
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
    "Multi",
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
      path: "estateApartment.buildingMaterial",
      label: "Building Material",
      options: buildingTypeEnum.enumValues,
      fieldValue: checkboxState.estateApartment.buildingMaterial,
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
      path: "multiselect.waterHeatSource",
      label: "Internet Connection",
      options: internetConnectionEnum.enumValues,
      fieldValue: checkboxState.multiselect.waterHeatSource,
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

        {estateType === "apartment" && (
          <RangeGroup
            label="Floor"
            fromKey="floorFrom"
            toKey="floorTo"
            state={inputState}
            onChange={updateInput}
          />
        )}

        {estateType === "house" && (
          <RangeGroup
            label="Land Area"
            fromKey="landAreaFrom"
            toKey="landAreaTo"
            state={inputState}
            onChange={updateInput}
          />
        )}

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

        <AiSearchTextarea
          value={inputState.aiSearch}
          onChange={(val) => updateInput("aiSearch", val)}
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
