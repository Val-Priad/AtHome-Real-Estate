"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { defaultInsertFormValues, InsertFormSchema } from "@/db/zodObjects";
import { SelectItem } from "@/components/ui/select";
import {
  advertRoomCountEnum,
  advertSubtypeEnum,
  buildingConditionEnum,
  buildingTypeEnum,
  circuitBreakerEnum,
  currencyEnum,
  energyClassEnum,
  estateCategoryEnum,
  flatClassEnum,
  furnishedEnum,
  houseCategoryEnum,
  houseTypeEnum,
  operationTypeEnum,
  phaseEnum,
  priceUnitEnum,
  regionEnum,
  roadTypeEnum,
} from "@/db/schema";
import { FormCheckbox, FormInput, FormSelect } from "@/components/ui/form";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";

import dynamic from "next/dynamic";

const ReadyDatePicker = dynamic(() => import("./components/DatePicker"), {
  ssr: false,
});

function Page() {
  const form = useForm({
    resolver: zodResolver(InsertFormSchema),
    defaultValues: defaultInsertFormValues,
  });

  const category = form.watch("estate.category");

  function onSubmit(values: z.infer<typeof InsertFormSchema>) {
    console.log("submission");
    console.log(values);
  }

  function alertData() {
    const values = form.getValues();
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <div className="flex justify-center px-2">
      <button
        className="fixed top-4 right-4 bg-amber-400"
        onClick={() => alertData()}
      >
        Show State
      </button>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border-brand-6 w-full max-w-3xl space-y-4 rounded-t-2xl border bg-stone-100 px-4 py-4"
      >
        <div className="space-y-3">
          <FieldGroup>
            <FormSelect
              control={form.control}
              name="estate.category"
              label="Category"
            >
              {estateCategoryEnum.enumValues.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </FormSelect>

            <FormSelect
              control={form.control}
              name="estate.operationType"
              label="Operation Type"
            >
              {operationTypeEnum.enumValues.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </FormSelect>

            <FormSelect
              control={form.control}
              name="estate.buildingCondition"
              label="Building Condition"
            >
              {buildingConditionEnum.enumValues.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </FormSelect>

            <FormSelect
              control={form.control}
              name="estate.energyClass"
              label="Energy Class"
            >
              {energyClassEnum.enumValues.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </FormSelect>

            <FormSelect
              control={form.control}
              name="estate.roadType"
              label="Road Type"
            >
              {roadTypeEnum.enumValues.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </FormSelect>

            <FormSelect
              control={form.control}
              name="estate.furnished"
              label="Furnished"
            >
              {furnishedEnum.enumValues.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </FormSelect>

            <FormSelect
              control={form.control}
              name="estate.currency"
              label="Currency"
            >
              {currencyEnum.enumValues.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </FormSelect>

            <FormSelect
              control={form.control}
              name="estate.priceUnit"
              label="Price Unit"
            >
              {priceUnitEnum.enumValues.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </FormSelect>

            <FormSelect
              control={form.control}
              name="estate.regionCode"
              label="Region"
            >
              {regionEnum.enumValues.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </FormSelect>

            <FieldGroup>
              <FormInput
                control={form.control}
                name="estate.usableArea"
                label="Usable Area"
              />
              <FormInput
                control={form.control}
                name="estate.totalFloorArea"
                label="Total Floor Area"
              />
              <FormInput
                control={form.control}
                name="estate.price"
                label="Price"
              />
              <FormInput
                control={form.control}
                name="estate.costOfLiving"
                label="Cost of Living"
              />
              <FormInput
                control={form.control}
                name="estate.commission"
                label="Commission"
              />
              <FormInput
                control={form.control}
                name="estate.refundableDeposit"
                label="Refundable Deposit"
              />
            </FieldGroup>

            <FieldGroup>
              <FormCheckbox
                control={form.control}
                name="estate.easyAccess"
                label="Easy Access"
              />
              <FormCheckbox
                control={form.control}
                name="estate.commissionPaidByOwner"
                label="Commission Paid By Owner"
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                control={form.control}
                name="estate.readyDate"
                render={({ field }) => (
                  <ReadyDatePicker
                    value={
                      field.value ? new Date(field.value as Date) : undefined
                    }
                    onChange={(date) => field.onChange(date ?? undefined)}
                  />
                )}
              />
              <FormInput
                control={form.control}
                name="estate.advertLifetime"
                label="Advert Lifetime (days)"
              />
            </FieldGroup>

            <FieldGroup>
              <FormInput
                control={form.control}
                name="estate.city"
                label="City"
              />
              <FormInput
                control={form.control}
                name="estate.street"
                label="Street"
              />
            </FieldGroup>

            <FieldGroup>
              <FormInput
                control={form.control}
                name="estate.latitude"
                label="Latitude"
              />
              <FormInput
                control={form.control}
                name="estate.longitude"
                label="Longitude"
              />
            </FieldGroup>
          </FieldGroup>

          {category === "Apartment" && (
            <FieldGroup>
              <FormSelect
                control={form.control}
                name="estateApartment.flatClass"
                label="Flat Class"
              >
                {flatClassEnum.enumValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </FormSelect>

              <FormSelect
                control={form.control}
                name="estateApartment.buildingType"
                label="Building Type"
              >
                {buildingTypeEnum.enumValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </FormSelect>

              <FormSelect
                control={form.control}
                name="estateApartment.advertSubtype"
                label="Advert Subtype"
              >
                {advertSubtypeEnum.enumValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </FormSelect>

              <FieldGroup>
                <FormInput
                  control={form.control}
                  name="estateApartment.floorNumber"
                  label="Floor Number"
                />

                <FormInput
                  control={form.control}
                  name="estateApartment.balconyArea"
                  label="Balcony Area"
                />
              </FieldGroup>

              <FieldGroup>
                <FormInput
                  control={form.control}
                  name="estateApartment.loggiaArea"
                  label="Loggia Area"
                />

                <FormInput
                  control={form.control}
                  name="estateApartment.terraceArea"
                  label="Terrace Area"
                />
              </FieldGroup>

              <FormInput
                control={form.control}
                name="estateApartment.apartmentNumber"
                label="Apartment Number"
              />

              <FieldGroup>
                <FormCheckbox
                  control={form.control}
                  name="estateApartment.garden"
                  label="Garden"
                />

                <FormCheckbox
                  control={form.control}
                  name="estateApartment.parking"
                  label="Parking"
                />

                <FormCheckbox
                  control={form.control}
                  name="estateApartment.elevator"
                  label="Elevator"
                />
              </FieldGroup>
            </FieldGroup>
          )}

          {category === "House" && (
            <>
              <FormSelect
                control={form.control}
                name="estateHouse.houseCategory"
                label="House Category"
              >
                {houseCategoryEnum.enumValues.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </FormSelect>

              <FormSelect
                control={form.control}
                name="estateHouse.roomCount"
                label="Room Count"
              >
                {advertRoomCountEnum.enumValues.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </FormSelect>

              <FormSelect
                control={form.control}
                name="estateHouse.houseType"
                label="House Type"
              >
                {houseTypeEnum.enumValues.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </FormSelect>

              <FormSelect
                control={form.control}
                name="estateHouse.circuitBreaker"
                label="Circuit Breaker"
              >
                {circuitBreakerEnum.enumValues.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </FormSelect>

              <FormSelect
                control={form.control}
                name="estateHouse.phase"
                label="Phase"
              >
                {phaseEnum.enumValues.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </FormSelect>

              <FieldGroup>
                <FormInput
                  control={form.control}
                  name="estateHouse.reconstructionYear"
                  label="Reconstruction Year"
                />

                <FormInput
                  control={form.control}
                  name="estateHouse.acceptanceYear"
                  label="Acceptance Year"
                />
              </FieldGroup>

              <FieldGroup>
                <FormInput
                  control={form.control}
                  name="estateHouse.floors"
                  label="Floors"
                />

                <FormInput
                  control={form.control}
                  name="estateHouse.undergroundFloors"
                  label="Underground Floors"
                />
              </FieldGroup>

              <FieldGroup>
                <FormInput
                  control={form.control}
                  name="estateHouse.parkingLotsCount"
                  label="Parking Lots Count"
                />

                <FormInput
                  control={form.control}
                  name="estateHouse.gardenArea"
                  label="Garden Area"
                />
              </FieldGroup>

              <FormInput
                control={form.control}
                name="estateHouse.buildingArea"
                label="Building Area"
              />

              <FieldGroup>
                <FormCheckbox
                  name="estateHouse.pool"
                  label="Pool"
                  control={form.control}
                />

                <FormCheckbox
                  name="estateHouse.cellar"
                  label="Cellar"
                  control={form.control}
                />
              </FieldGroup>

              <FieldGroup>
                <FormCheckbox
                  name="estateHouse.garage"
                  label="Garage"
                  control={form.control}
                />

                <FormCheckbox
                  name="estateHouse.pvPanels"
                  label="PV Panels"
                  control={form.control}
                />
              </FieldGroup>

              <FormCheckbox
                name="estateHouse.solarWaterHeating"
                label="Solar Water Heating"
                control={form.control}
              />
            </>
          )}

          <FieldGroup> </FieldGroup>

          <button
            type="submit"
            className="rounded bg-green-500 px-4 py-2 text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
export default Page;
