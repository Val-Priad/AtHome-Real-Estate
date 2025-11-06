"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { defaultInsertFormValues, InsertFormSchema } from "@/db/zodObjects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  apartmentPlanEnum,
  buildingConditionEnum,
  buildingTypeEnum,
  circuitBreakerEnum,
  currencyEnum,
  energyClassEnum,
  estateCategoryEnum,
  flatClassEnum,
  furnishedEnum,
  houseCategoryEnum,
  roomCountEnum,
  houseTypeEnum,
  operationTypeEnum,
  phaseEnum,
  priceUnitEnum,
  regionEnum,
  roadTypeEnum,
  electricityEnum,
  heatingSourceEnum,
  heatingElementEnum,
  waterHeatSourceEnum,
  waterEnum,
  internetConnectionEnum,
  telecommunicationEnum,
} from "@/db/schema";
import { FormCheckbox, FormInput, FormSelect } from "@/components/ui/form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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
            <Controller
              name="estate.category"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Estate Category</FieldLabel>
                  <Select {...field} onValueChange={onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {estateCategoryEnum.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="estate.operationType"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Operation Type</FieldLabel>
                  <Select {...field} onValueChange={onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operationTypeEnum.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="estate.buildingCondition"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Building Condition
                  </FieldLabel>
                  <Select {...field} onValueChange={onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingConditionEnum.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="estate.energyClass"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Energy Class</FieldLabel>
                  <Select {...field} onValueChange={onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {energyClassEnum.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="estate.roadType"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Road Type</FieldLabel>
                  <Select {...field} onValueChange={onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roadTypeEnum.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="estate.furnished"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Furnished</FieldLabel>
                  <Select {...field} onValueChange={onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {furnishedEnum.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="estate.currency"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Currency</FieldLabel>
                  <Select {...field} onValueChange={onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyEnum.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="estate.priceUnit"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Price Unit</FieldLabel>
                  <Select {...field} onValueChange={onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceUnitEnum.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="estate.region"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Region</FieldLabel>
                  <Select {...field} onValueChange={onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regionEnum.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <FieldGroup>
              <Controller
                name="estate.usableArea"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Usable Area</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as number}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estate.totalFloorArea"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Total Floor Area
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as number}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estate.price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as number}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estate.costOfLiving"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Cost of Living</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as number}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estate.commission"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Commission</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as number}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estate.refundableDeposit"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Refundable Deposit
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as number}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="estate.easyAccess"
                control={form.control}
                render={({
                  field: { value, onChange, ...field },
                  fieldState,
                }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      {...field}
                      id={field.name}
                      onCheckedChange={onChange}
                      checked={value}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel htmlFor={field.name} className="font-normal">
                      Easy Access
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estate.commissionPaidByOwner"
                control={form.control}
                render={({
                  field: { value, onChange, ...field },
                  fieldState,
                }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      {...field}
                      id={field.name}
                      onCheckedChange={onChange}
                      checked={value}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel htmlFor={field.name} className="font-normal">
                      Commission is Paid by Owner
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
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

              <Controller
                name="estate.advertLifetime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Advert Lifetime
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as number}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="estate.city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>City</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as string}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="estate.street"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Street</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as string}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="estate.latitude"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Latitude</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as number}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="estate.longitude"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Longitude</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as number}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldGroup>

          {category === "Apartment" && (
            <FieldGroup>
              <Controller
                name="estateApartment.flatClass"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Flat Class</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={onChange}
                      value={field.name}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        onBlur={field.onBlur}
                        id={field.name}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {flatClassEnum.enumValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estateApartment.buildingType"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Building Type</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={onChange}
                      value={field.name}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        onBlur={field.onBlur}
                        id={field.name}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {buildingTypeEnum.enumValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estateApartment.apartmentPlan"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Apartment Plan</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={onChange}
                      value={field.name}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        onBlur={field.onBlur}
                        id={field.name}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {apartmentPlanEnum.enumValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estateApartment.floorNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Floor Number</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as number}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldGroup>
                <Controller
                  name="estateApartment.balconyArea"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Balcony Area</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as number}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="estateApartment.loggiaArea"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Loggia Area</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as number}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="estateApartment.terraceArea"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Terrace Area</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as number}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Controller
                name="estateApartment.apartmentNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Apartment Number
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value as string}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldGroup>
                <Controller
                  name="estateApartment.garden"
                  control={form.control}
                  render={({
                    field: { value, onChange, ...field },
                    fieldState,
                  }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        {...field}
                        id={field.name}
                        onCheckedChange={onChange}
                        checked={value}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={field.name} className="font-normal">
                        Garden
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="estateApartment.parking"
                  control={form.control}
                  render={({
                    field: { value, onChange, ...field },
                    fieldState,
                  }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        {...field}
                        id={field.name}
                        onCheckedChange={onChange}
                        checked={value}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={field.name} className="font-normal">
                        Parking
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="estateApartment.elevator"
                  control={form.control}
                  render={({
                    field: { value, onChange, ...field },
                    fieldState,
                  }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        {...field}
                        id={field.name}
                        onCheckedChange={onChange}
                        checked={value}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={field.name} className="font-normal">
                        Elevator
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldGroup>
          )}

          {category === "House" && (
            <>
              <Controller
                name="estateHouse.houseCategory"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>House Category</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={onChange}
                      value={field.name}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        onBlur={field.onBlur}
                        id={field.name}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {houseCategoryEnum.enumValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estateHouse.roomCount"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Room Count</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={onChange}
                      value={field.name}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        onBlur={field.onBlur}
                        id={field.name}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roomCountEnum.enumValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estateHouse.houseType"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>House Type</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={onChange}
                      value={field.name}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        onBlur={field.onBlur}
                        id={field.name}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {houseTypeEnum.enumValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="estateHouse.circuitBreaker"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Circuit Breaker
                    </FieldLabel>
                    <Select
                      {...field}
                      onValueChange={onChange}
                      value={field.name}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        onBlur={field.onBlur}
                        id={field.name}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {circuitBreakerEnum.enumValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="estateHouse.phase"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Phase</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={onChange}
                      value={field.name}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        onBlur={field.onBlur}
                        id={field.name}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {phaseEnum.enumValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldGroup>
                <Controller
                  name="estateHouse.reconstructionYear"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Reconstruction Year
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as string}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="estateHouse.acceptanceYear"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Acceptance Year
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as string}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="estateHouse.floors"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Floors</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as string}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="estateHouse.undergroundFloors"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Underground Floors
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as string}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="estateHouse.parkingLotsCount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Parking Lots Count
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as string}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="estateHouse.gardenArea"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Garden Area</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as string}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="estateHouse.buildingArea"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Building Area
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as string}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="estateHouse.pool"
                  control={form.control}
                  render={({
                    field: { value, onChange, ...field },
                    fieldState,
                  }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        {...field}
                        id={field.name}
                        onCheckedChange={onChange}
                        checked={value}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={field.name} className="font-normal">
                        Pool
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="estateHouse.cellar"
                  control={form.control}
                  render={({
                    field: { value, onChange, ...field },
                    fieldState,
                  }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        {...field}
                        id={field.name}
                        onCheckedChange={onChange}
                        checked={value}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={field.name} className="font-normal">
                        Cellar
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="estateHouse.garage"
                  control={form.control}
                  render={({
                    field: { value, onChange, ...field },
                    fieldState,
                  }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        {...field}
                        id={field.name}
                        onCheckedChange={onChange}
                        checked={value}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={field.name} className="font-normal">
                        Garage
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="estateHouse.pvPanels"
                  control={form.control}
                  render={({
                    field: { value, onChange, ...field },
                    fieldState,
                  }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        {...field}
                        id={field.name}
                        onCheckedChange={onChange}
                        checked={value}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={field.name} className="font-normal">
                        PV Panels
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="estateHouse.solarWaterHeating"
                  control={form.control}
                  render={({
                    field: { value, onChange, ...field },
                    fieldState,
                  }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        {...field}
                        id={field.name}
                        onCheckedChange={onChange}
                        checked={value}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={field.name} className="font-normal">
                        Solar Water Heating
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </>
          )}

          <FieldGroup>
            <Controller
              name="multiselect.estateHeatingSource"
              control={form.control}
              render={({
                field: { value = [], onChange, ...field },
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>Heating Source</FieldLabel>
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    {heatingSourceEnum.enumValues.map((option) => {
                      const isChecked = value.includes(option);

                      return (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${field.name}-${option}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                onChange([...value, option]);
                              } else {
                                onChange(value.filter((v) => v !== option));
                              }
                            }}
                            aria-invalid={fieldState.invalid}
                          />
                          <FieldLabel
                            htmlFor={`${field.name}-${option}`}
                            className="font-normal"
                          >
                            {option}
                          </FieldLabel>
                        </div>
                      );
                    })}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </Field>
              )}
            />
            <Controller
              name="multiselect.estateHeatingElement"
              control={form.control}
              render={({
                field: { value = [], onChange, ...field },
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>Heating Element</FieldLabel>
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    {heatingElementEnum.enumValues.map((option) => {
                      const isChecked = value.includes(option);

                      return (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${field.name}-${option}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                onChange([...value, option]);
                              } else {
                                onChange(value.filter((v) => v !== option));
                              }
                            }}
                            aria-invalid={fieldState.invalid}
                          />
                          <FieldLabel
                            htmlFor={`${field.name}-${option}`}
                            className="font-normal"
                          >
                            {option}
                          </FieldLabel>
                        </div>
                      );
                    })}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </Field>
              )}
            />
            <Controller
              name="multiselect.estateWaterHeatSource"
              control={form.control}
              render={({
                field: { value = [], onChange, ...field },
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>Water Heat Source</FieldLabel>
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    {waterHeatSourceEnum.enumValues.map((option) => {
                      const isChecked = value.includes(option);

                      return (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${field.name}-${option}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                onChange([...value, option]);
                              } else {
                                onChange(value.filter((v) => v !== option));
                              }
                            }}
                            aria-invalid={fieldState.invalid}
                          />
                          <FieldLabel
                            htmlFor={`${field.name}-${option}`}
                            className="font-normal"
                          >
                            {option}
                          </FieldLabel>
                        </div>
                      );
                    })}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </Field>
              )}
            />
            <Controller
              name="multiselect.estateWater"
              control={form.control}
              render={({
                field: { value = [], onChange, ...field },
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>Water</FieldLabel>
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    {waterEnum.enumValues.map((option) => {
                      const isChecked = value.includes(option);

                      return (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${field.name}-${option}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                onChange([...value, option]);
                              } else {
                                onChange(value.filter((v) => v !== option));
                              }
                            }}
                            aria-invalid={fieldState.invalid}
                          />
                          <FieldLabel
                            htmlFor={`${field.name}-${option}`}
                            className="font-normal"
                          >
                            {option}
                          </FieldLabel>
                        </div>
                      );
                    })}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </Field>
              )}
            />
            <Controller
              name="multiselect.estateElectricity"
              control={form.control}
              render={({
                field: { value = [], onChange, ...field },
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>Electricity</FieldLabel>
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    {electricityEnum.enumValues.map((option) => {
                      const isChecked = value.includes(option);

                      return (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${field.name}-${option}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                onChange([...value, option]);
                              } else {
                                onChange(value.filter((v) => v !== option));
                              }
                            }}
                            aria-invalid={fieldState.invalid}
                          />
                          <FieldLabel
                            htmlFor={`${field.name}-${option}`}
                            className="font-normal"
                          >
                            {option}
                          </FieldLabel>
                        </div>
                      );
                    })}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </Field>
              )}
            />
            <Controller
              name="multiselect.estateInternetConnections"
              control={form.control}
              render={({
                field: { value = [], onChange, ...field },
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>Internet</FieldLabel>
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    {internetConnectionEnum.enumValues.map((option) => {
                      const isChecked = value.includes(option);

                      return (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${field.name}-${option}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                onChange([...value, option]);
                              } else {
                                onChange(value.filter((v) => v !== option));
                              }
                            }}
                            aria-invalid={fieldState.invalid}
                          />
                          <FieldLabel
                            htmlFor={`${field.name}-${option}`}
                            className="font-normal"
                          >
                            {option}
                          </FieldLabel>
                        </div>
                      );
                    })}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </Field>
              )}
            />
            <Controller
              name="multiselect.estateTelecommunication"
              control={form.control}
              render={({
                field: { value = [], onChange, ...field },
                fieldState,
              }) => (
                <Field>
                  <FieldLabel>Internet</FieldLabel>
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    {telecommunicationEnum.enumValues.map((option) => {
                      const isChecked = value.includes(option);

                      return (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${field.name}-${option}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                onChange([...value, option]);
                              } else {
                                onChange(value.filter((v) => v !== option));
                              }
                            }}
                            aria-invalid={fieldState.invalid}
                          />
                          <FieldLabel
                            htmlFor={`${field.name}-${option}`}
                            className="font-normal"
                          >
                            {option}
                          </FieldLabel>
                        </div>
                      );
                    })}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </Field>
              )}
            />
          </FieldGroup>

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
