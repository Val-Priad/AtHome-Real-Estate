"use client";

import { HiMiniMagnifyingGlass } from "react-icons/hi2";
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
  VICINITY_OPTIONS,
  REGION_OPTIONS,
  DISTANCE_TO_FACILITIES,
  REGION,
  toSnakeCase,
  SMART_SEARCH,
} from "./components/options";
import Section from "./components/Section";
import SectionWithCheckboxes from "./components/SectionWithCheckboxes";
import FromToSection from "./components/FromToSection";
import Button from "@/components/ui/Button";
import SectionWithDropdown from "./components/SectionWithDropdown";
import Map from "./components/Map";
import SectionWithTextarea from "./components/SectionWithTextarea";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [propertyType, setPropertyType] = useState<TPropertyType>(
    params.get("property-type") as TPropertyType,
  );
  const [formData, setFormData] = useState<SearchFormData>({});

  const selectedRegions = formData[toSnakeCase(REGION)] as string[] | undefined;

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
            [name]: [...currentValue, value],
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

  const handleSelectChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleMapChange = useCallback((regionTitle: string) => {
    const name = toSnakeCase(REGION);
    setFormData((prev) => {
      const currentValue = (prev[name] as string[]) || [];
      if (currentValue.length === 0) {
        return { ...prev, [name]: [regionTitle] };
      }

      if (currentValue.includes(regionTitle)) {
        const newValues = currentValue.filter((value) => value !== regionTitle);
        return {
          ...prev,
          [name]: newValues.length > 0 ? newValues : undefined,
        };
      }

      return { ...prev, [name]: [...currentValue, regionTitle] };
    });
  }, []);

  const handleTextareaChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  function isChecked(name: keyof SearchFormData, value: string) {
    const field = formData[name];
    return Array.isArray(field) && field.includes(value);
  }

  function buildQueryString(
    formData: SearchFormData,
    propertyType: TPropertyType,
  ) {
    const params = new URLSearchParams();

    if (propertyType) {
      params.set("property_type", propertyType);
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (!value) return;

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });

    return params.toString();
  }

  function handleSearchClick() {
    const queryString = buildQueryString(formData, propertyType);
    router.push(`/search/results?${queryString}`);
  }

  return (
    <main className="flex justify-center px-2">
      <form
        className="border-brand-6 relative max-w-228 rounded-t-2xl border border-b-0 bg-stone-100 px-4 py-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-brand-10 text-h5 mb-7.5 text-center">
          Property Search Filters
        </h1>

        <Map
          handleMapChange={handleMapChange}
          selectedRegions={selectedRegions}
        />

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
          sectionName={REGION}
          handleInputChange={handleInputChange}
          isChecked={isChecked}
          options={REGION_OPTIONS}
        />

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
            formData={formData}
          />
        )}

        {propertyType === "house" && (
          <FromToSection
            handleInputChange={handleInputChange}
            sectionName="Land Area"
            isArea={true}
            formData={formData}
          />
        )}

        <FromToSection
          handleInputChange={handleInputChange}
          sectionName="Usable Area"
          isArea={true}
          formData={formData}
        />

        <FromToSection
          handleInputChange={handleInputChange}
          sectionName="Price"
          currency="$"
          formData={formData}
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

        <SectionWithDropdown
          sectionName={DISTANCE_TO_FACILITIES}
          options={VICINITY_OPTIONS}
          handleSelectChange={handleSelectChange}
        />

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

        <SectionWithTextarea
          sectionName={SMART_SEARCH}
          handleTextareaChange={handleTextareaChange}
        />

        <div className="flex w-full justify-between gap-4">
          <button
            onClick={() => handleTypeChange(propertyType)}
            className="border-brand-6 hover:border-brand-7 text-brand-10 my-8 w-full cursor-pointer rounded-lg border py-1 transition-colors"
          >
            Clear
          </button>

          <button
            onClick={() => handleSearchClick()}
            className="bg-brand-6 hover:bg-brand-7 my-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-1 text-stone-100 transition-colors"
          >
            <span>See N results</span>
            <HiMiniMagnifyingGlass />
          </button>
        </div>
      </form>
    </main>
  );
}

export default Page;
