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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ReactNode, useEffect, useState } from "react";
import generateDescription from "@/lib/api/generateDescription";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { fetchVicinity } from "@/lib/api/fetchVicinity";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Plus, Star, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { formatErrors } from "./components/formatErrors";
import { insertEstate } from "@/lib/actions/estate/addEstate";
import { getS3PresignedUrl } from "@/lib/actions/getS3PresignedUrl";
import { getAllBrokers } from "@/lib/actions/user/getAllBrokers";

const ReadyDatePicker = dynamic(() => import("./components/DatePicker"), {
  ssr: false,
});

function Page() {
  const MAX_VIDEO_SIZE_MB = 50;
  const MAX_VIDEO_DURATION_SEC = 120;
  const MAX_IMAGE_SIZE_MB = 10;
  const [tabDescriptionValue, setTabDescriptionValue] = useState("ua");
  const [tabVicinityValue, setTabVicinityValue] = useState("Closest");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearchingVicinity, setIsSearchingVicinity] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(InsertFormSchema),
    defaultValues: defaultInsertFormValues,
  });

  const category = form.watch("estate.category");
  const vicinity = form.watch("vicinity");
  const [brokers, setBrokers] = useState<{ id: string; name: string | null }[]>(
    [],
  );

  useEffect(() => {
    async function load() {
      const result = await getAllBrokers();
      setBrokers(result);
    }
    load();
  }, []);

  async function onSubmit(values: z.infer<typeof InsertFormSchema>) {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          setIsSubmitting(true);
          const uploadedItems = await uploadFilesToS3();

          const dataToSubmit = { ...values, media: uploadedItems };

          const response = await insertEstate(dataToSubmit);

          setIsSubmitting(false);
          if (response.success) {
            resolve("Estate created successfully! Redirecting...");
          } else if ("error" in response) {
            reject(`Failed: ${response.error}`);
          } else {
            reject("Unknown error");
          }
        } catch (err) {
          console.error(err);
          setIsSubmitting(false);
          reject("Upload or save failed");
        }
      }),
      {
        loading: "Uploading files & saving estate...",
        success: (message) => message as ReactNode,
        error: (err) => err || "Unexpected error occurred",
      },
    );
  }

  async function uploadFilesToS3() {
    const allMedia = form.getValues("media");

    const uploadedItems: {
      url: string;
      type: "image" | "video";
      alt?: string;
      isMain: boolean;
    }[] = [];

    for (const mediaItem of allMedia) {
      try {
        if (!mediaItem.file) {
          uploadedItems.push({
            url: mediaItem.url,
            type: mediaItem.type as "image" | "video",
            alt: mediaItem.alt,
            isMain: mediaItem.isMain ?? false,
          });
          continue;
        }

        const { uploadUrl, publicUrl } = await getS3PresignedUrl(
          mediaItem.file.name,
          mediaItem.file.type,
        );

        if (!uploadUrl || !publicUrl) {
          throw new Error("Failed to get S3 presigned URL");
        }

        const response = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": mediaItem.file.type },
          body: mediaItem.file,
        });

        if (!response.ok) {
          throw new Error(
            `S3 upload failed with status ${response.status} (${response.statusText})`,
          );
        }

        uploadedItems.push({
          url: publicUrl,
          type: mediaItem.type as "image" | "video",
          alt: mediaItem.alt,
          isMain: mediaItem.isMain ?? false,
        });
      } catch (error) {
        console.error("Error uploading media item:", mediaItem, error);

        if (error instanceof Error) {
          toast.error(
            `Failed to upload ${mediaItem.file?.name || "media"}: ${error.message}`,
          );
        } else {
          toast.error(
            `Unknown error while uploading ${mediaItem.file?.name || "media"}`,
          );
        }

        throw error;
      }
    }

    return uploadedItems;
  }

  function alertData() {
    const values = form.getValues();
    console.log(form.getValues().media);

    alert(JSON.stringify(values));
  }

  async function handleVicinitySearch() {
    setIsSearchingVicinity(true);
    const result = await fetchVicinity(
      Number(form.getValues("estate.latitude")),
      Number(form.getValues("estate.longitude")),
    );

    if (!result.ok) {
      toast.error(result.message);
    } else {
      form.setValue("vicinity", result.data);
      console.log(result);
      toast.success("Vicinity data was fetched successfully!");
    }

    setIsSearchingVicinity(false);
  }

  async function handleGenerate() {
    setIsGenerating(true);
    const estateObject = form.getValues();
    const filteredObject = {
      ...estateObject,
      vicinity: {
        Closest: estateObject.vicinity?.Closest ?? [],
      },
      media: {},
    };
    const result = await generateDescription(filteredObject);
    if (!result.ok) {
      toast.error(result.message);
    } else {
      form.setValue("translations.description", {
        ua: result.ua ?? "",
        en: result.en ?? "",
      });
      toast.success("Description is generated successfully!");
    }

    setIsGenerating(false);
  }

  return (
    <div className="flex justify-center px-2">
      <Toaster position="top-center" richColors />

      <button
        className="fixed top-4 right-4 bg-amber-400"
        onClick={() => alertData()}
      >
        Show State
      </button>
      <form
        onSubmit={form.handleSubmit(
          (values) => {
            onSubmit(values);
          },
          (errors) => {
            toast.error(formatErrors(errors));
          },
        )}
        className="border-brand-6 w-full max-w-3xl space-y-4 rounded-t-2xl border bg-stone-100 px-4 py-4"
      >
        <div className="space-y-3">
          <FieldGroup>
            <Controller
              name="estate.brokerId"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Broker</FieldLabel>

                  <Select {...field} onValueChange={(value) => onChange(value)}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      id={field.name}
                      onBlur={field.onBlur}
                    >
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>

                    <SelectContent>
                      {brokers.map((broker) => (
                        <SelectItem key={broker.id} value={broker.id}>
                          {broker.name}
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
                  <FieldLabel htmlFor={field.name}>Total Floor Area</FieldLabel>
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
                  <FieldLabel htmlFor={field.name}>Advert Lifetime</FieldLabel>
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

            <Button
              type="button"
              onClick={handleVicinitySearch}
              disabled={isSearchingVicinity}
            >
              {isSearchingVicinity ? (
                <>Searching Vicinity</>
              ) : (
                <>Fetch Vicinity Data</>
              )}
            </Button>

            {vicinity &&
              Object.values(vicinity).some(
                (places) => Array.isArray(places) && places.length > 0,
              ) && (
                <Tabs
                  value={tabVicinityValue}
                  onValueChange={setTabVicinityValue}
                  className=""
                >
                  <div className="overflow-x-scroll">
                    <TabsList className="">
                      {(Object.keys(vicinity) as (keyof typeof vicinity)[]).map(
                        (type) => (
                          <TabsTrigger key={type} value={type as string}>
                            {type}
                          </TabsTrigger>
                        ),
                      )}
                    </TabsList>
                  </div>
                  {(Object.keys(vicinity) as (keyof typeof vicinity)[]).map(
                    (type) => (
                      <TabsContent key={type} value={type as string}>
                        <div className="max-h-[200px] overflow-y-auto p-3">
                          <div className="grid grid-cols-2 gap-3">
                            {vicinity[type].map((place) => (
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
                    ),
                  )}
                </Tabs>
              )}
          </FieldGroup>

          {category === "Apartment" && (
            <FieldGroup>
              <Controller
                name="estateApartment.flatClass"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Flat Class</FieldLabel>
                    <Select {...field} onValueChange={onChange}>
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
                    <Select {...field} onValueChange={onChange}>
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
                    <Select {...field} onValueChange={onChange}>
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
          )}

          {category === "House" && (
            <>
              <Controller
                name="estateHouse.houseCategory"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>House Category</FieldLabel>
                    <Select {...field} onValueChange={onChange}>
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
                    <Select {...field} onValueChange={onChange}>
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
                    <Select {...field} onValueChange={onChange}>
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
                    <Select {...field} onValueChange={onChange}>
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
                    <Select {...field} onValueChange={onChange}>
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
                    <FieldLabel htmlFor={field.name}>Building Area</FieldLabel>
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

          <div className="space-y-3">
            <Tabs
              value={tabDescriptionValue}
              onValueChange={setTabDescriptionValue}
              className="w-full"
            >
              <TabsList className="mb-2 grid grid-cols-2">
                <TabsTrigger value="ua">🇺🇦 Ukrainian</TabsTrigger>
                <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              </TabsList>

              <TabsContent value="ua" className="space-y-3">
                <Controller
                  name="translations.title.ua"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Ukrainian Title
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as string}
                        placeholder="Ukrainian title waits to be written..."
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="translations.description.ua"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Ukrainian Description
                      </FieldLabel>
                      <Textarea
                        {...field}
                        value={field.value}
                        rows={3}
                        placeholder="Ukrainian description will appear here..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </TabsContent>

              <TabsContent value="en" className="space-y-3">
                <Controller
                  name="translations.title.en"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        English Title
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value as string}
                        placeholder="English title waits to be written..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="translations.description.en"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        English Description
                      </FieldLabel>
                      <Textarea
                        {...field}
                        value={field.value}
                        rows={3}
                        placeholder="English description will appear here..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </TabsContent>
            </Tabs>

            <Button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Click to generate description"}
            </Button>
          </div>

          <Controller
            name="media"
            control={form.control}
            render={({ field: { value = [], onChange }, fieldState }) => {
              const handleFileUpload = async (
                e: React.ChangeEvent<HTMLInputElement>,
              ) => {
                const files = e.target.files;
                if (!files?.length) return;

                const validItems: typeof value = [];

                for (const file of Array.from(files)) {
                  const isVideo = file.type.startsWith("video/");
                  const isImage = file.type.startsWith("image/");

                  const fileSizeMB = file.size / (1024 * 1024);
                  if (isVideo && fileSizeMB > MAX_VIDEO_SIZE_MB) {
                    toast.error(
                      `Video "${file.name}" is too large. Max size is ${MAX_VIDEO_SIZE_MB}MB.`,
                    );
                    continue;
                  }

                  if (isImage && fileSizeMB > MAX_IMAGE_SIZE_MB) {
                    toast.error(
                      `Image "${file.name}" is too large. Max size is ${MAX_IMAGE_SIZE_MB}MB.`,
                    );
                    continue;
                  }

                  if (isVideo) {
                    const durationOk = await new Promise<boolean>((resolve) => {
                      const videoEl = document.createElement("video");
                      videoEl.preload = "metadata";

                      videoEl.onloadedmetadata = () => {
                        URL.revokeObjectURL(videoEl.src);
                        const duration = videoEl.duration;
                        resolve(duration <= MAX_VIDEO_DURATION_SEC);
                      };

                      videoEl.onerror = () => {
                        toast.error(`Failed to read video "${file.name}".`);
                        resolve(false);
                      };

                      videoEl.src = URL.createObjectURL(file);
                    });

                    if (!durationOk) {
                      toast.error(
                        `Video "${file.name}" is too long. Max duration is ${MAX_VIDEO_DURATION_SEC / 60} minutes.`,
                      );
                      continue;
                    }
                  }

                  validItems.push({
                    url: URL.createObjectURL(file),
                    file,
                    alt: file.name,
                    type: isVideo ? "video" : "image",
                    isMain: false,
                  });
                }

                if (validItems.length > 0) {
                  onChange([...value, ...validItems]);
                }

                e.target.value = "";
              };

              const removeItem = (index: number) => {
                onChange(value.filter((_, i) => i !== index));
              };

              const setMain = (index: number) => {
                onChange(
                  value.map((item, i) => ({
                    ...item,
                    isMain: i === index,
                  })),
                );
              };

              return (
                <>
                  <FieldLabel>Add media (photos or videos)</FieldLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {value.map((item, index) => (
                      <Card
                        key={index}
                        className={`relative overflow-hidden rounded-xl border transition ${
                          item.isMain
                            ? "border-primary ring-primary/50 ring-2"
                            : "border-muted"
                        }`}
                      >
                        <CardContent className="relative p-0">
                          {item.type === "image" && item.url && (
                            <Image
                              src={item.url}
                              alt={item.alt || "Uploaded image"}
                              width={300}
                              height={200}
                              className="h-32 w-full object-cover"
                            />
                          )}
                          {item.type === "video" && item.url && (
                            <video
                              src={item.url}
                              className="h-32 w-full object-cover"
                              controls
                            />
                          )}
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              onClick={() => removeItem(index)}
                              className="h-7 w-7 rounded-full opacity-90 hover:opacity-100"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant={item.isMain ? "default" : "secondary"}
                              onClick={() => setMain(index)}
                              className="h-7 w-7 rounded-full opacity-90 hover:opacity-100"
                              title="Set as main"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  item.isMain
                                    ? "text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                                fill={item.isMain ? "currentColor" : "none"}
                              />
                            </Button>
                          </div>
                        </CardContent>
                        {item.isMain && (
                          <div className="bg-primary/80 absolute bottom-1 left-1 rounded-md px-2 py-0.5 text-xs text-white">
                            Main
                          </div>
                        )}
                      </Card>
                    ))}

                    <Label
                      htmlFor="media-upload"
                      className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/30 flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed"
                    >
                      <input
                        id="media-upload"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.mp4"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Plus className="mb-1 h-6 w-6" />
                      <span className="text-sm font-medium">
                        Add photo or video
                      </span>
                    </Label>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </>
              );
            }}
          />

          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
export default Page;
