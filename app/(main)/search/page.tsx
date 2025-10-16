"use client";

import { useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import {
  CAMEL_ARRAY_FIELDS,
  VICINITY_FEATURE_OPTIONS,
  FEATURES_IN_THE_VICINITY,
  FLOOR_PLAN,
  FLOOR_PLAN_OPTIONS,
  CONDITION,
  CONDITION_OPTIONS,
  APARTMENT_ACCESSORY_OPTIONS,
  ACCESSORIES,
  ENERGY_CLASS,
  ENERGY_CLASS_OPTIONS,
  OFFER_TYPE,
  OFFER_TYPE_OPTIONS,
  HOUSE_CATEGORY,
  HOUSE_CATEGORY_OPTIONS,
  HOUSE_SIZE,
  HOUSE_SIZE_OPTIONS,
  HOUSE_ACCESSORY_OPTIONS,
  BUILDING_MATERIAL,
  BUILDING_MATERIAL_OPTIONS,
} from "./components/options";
import Section from "./components/Section";
import SectionWithCheckboxes from "./components/SectionWithCheckboxes";
import FromToSection from "./components/FromToSection";
import Button from "@/components/ui/Button";

export interface SearchFormData {
  location?: string;
  area_min?: string;
  area_max?: string;
  price_min?: string;
  price_max?: string;
  smartSearch?: string;
  [key: string]: string | string[] | undefined;
}

export type TPropertyType = "apartment" | "house" | null;

function Page() {
  const params = useSearchParams();
  const [propertyType, setPropertyType] = useState<TPropertyType>(
    params.get("property-type") as TPropertyType,
  );
  const [formData, setFormData] = useState<SearchFormData>({});

  function handleTypeChange(newType: TPropertyType) {
    setPropertyType((prev) => (newType === prev ? null : newType));
    setFormData({});
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const isArrayField = CAMEL_ARRAY_FIELDS.includes(name);

      if (type === "checkbox" && isArrayField) {
        const currentValue = (prev[name] as string[]) || [];

        if (checked) {
          return {
            ...prev,
            [name]: Array.from(new Set([...currentValue, value])),
          };
        } else {
          const newValues = currentValue.filter((v) => v !== value);
          return {
            ...prev,
            [name]: newValues.length > 0 ? newValues : undefined,
          };
        }
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  }, []);

  function isChecked(name: keyof SearchFormData, value: string) {
    const field = formData[name];
    return Array.isArray(field) && field.includes(value);
  }

  return (
    <main className="flex justify-center">
      <form
        className="border-brand-6 w-full rounded-t-2xl border border-b-0 bg-stone-100 px-4 py-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-brand-10 text-h5 mb-7.5 text-center">
          Property Search Filters
        </h1>

        <Section sectionName="Property Type">
          <div className="space-y-2">
            <div className="mt-2 flex rounded-md bg-red-100">
              <Button
                type="search-checkbox-btn"
                onClick={() => handleTypeChange("apartment")}
                forPropertyType={"apartment"}
                curPropertyType={propertyType}
              >
                Apartment
              </Button>
              <Button
                type="search-checkbox-btn"
                forPropertyType={"house"}
                curPropertyType={propertyType}
                onClick={() => handleTypeChange("house")}
              >
                House
              </Button>
            </div>

            {!propertyType && (
              <p className="text-small text-center text-stone-500">
                * Property type not specified: searching for all property types.
              </p>
            )}
          </div>
        </Section>

        <SectionWithCheckboxes
          sectionName={OFFER_TYPE}
          handleInputChange={handleInputChange}
          isChecked={isChecked}
          options={OFFER_TYPE_OPTIONS}
        />

        {propertyType === "apartment" && (
          <SectionWithCheckboxes
            sectionName={FLOOR_PLAN}
            handleInputChange={handleInputChange}
            isChecked={isChecked}
            options={FLOOR_PLAN_OPTIONS}
          />
        )}

        {propertyType === "house" && (
          <>
            <SectionWithCheckboxes
              sectionName={HOUSE_CATEGORY}
              handleInputChange={handleInputChange}
              isChecked={isChecked}
              options={HOUSE_CATEGORY_OPTIONS}
            />
            <SectionWithCheckboxes
              sectionName={HOUSE_SIZE}
              handleInputChange={handleInputChange}
              isChecked={isChecked}
              options={HOUSE_SIZE_OPTIONS}
            />{" "}
          </>
        )}

        {propertyType === "apartment" && (
          <FromToSection
            handleInputChange={handleInputChange}
            sectionName="Floor"
          />
        )}

        {propertyType === "house" && (
          <FromToSection
            handleInputChange={handleInputChange}
            sectionName="Land Area"
            isArea={true}
          />
        )}

        <FromToSection
          handleInputChange={handleInputChange}
          sectionName="Usable Area"
          isArea={true}
        />

        <FromToSection
          handleInputChange={handleInputChange}
          sectionName="Price"
          currency="$"
        />

        <SectionWithCheckboxes
          sectionName={CONDITION}
          handleInputChange={handleInputChange}
          isChecked={isChecked}
          options={CONDITION_OPTIONS}
        />

        {propertyType === "apartment" && (
          <SectionWithCheckboxes
            sectionName={BUILDING_MATERIAL}
            handleInputChange={handleInputChange}
            isChecked={isChecked}
            options={BUILDING_MATERIAL_OPTIONS}
          />
        )}

        {propertyType === "apartment" && (
          <SectionWithCheckboxes
            sectionName={ACCESSORIES}
            options={APARTMENT_ACCESSORY_OPTIONS}
            handleInputChange={handleInputChange}
            isChecked={isChecked}
          />
        )}

        {propertyType === "house" && (
          <SectionWithCheckboxes
            sectionName={ACCESSORIES}
            options={HOUSE_ACCESSORY_OPTIONS}
            handleInputChange={handleInputChange}
            isChecked={isChecked}
          />
        )}

        <SectionWithCheckboxes
          sectionName={FEATURES_IN_THE_VICINITY}
          handleInputChange={handleInputChange}
          isChecked={isChecked}
          options={VICINITY_FEATURE_OPTIONS}
        />

        <SectionWithCheckboxes
          sectionName={ENERGY_CLASS}
          handleInputChange={handleInputChange}
          isChecked={isChecked}
          options={ENERGY_CLASS_OPTIONS}
        />
      </form>
    </main>
  );
}

export default Page;
