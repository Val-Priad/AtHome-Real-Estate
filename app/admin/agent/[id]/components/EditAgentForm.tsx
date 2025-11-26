"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast, Toaster } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import {
  userProfileSchema,
  userProfileSchemaDefaultValues,
  UserProfileValues,
} from "@/db/zodObjects";

import { getS3PresignedUrl } from "@/lib/actions/getS3PresignedUrl";
import { updateAgent } from "@/lib/actions/user/updateAgent";
import { User } from "@/db/types";

export default function EditAgentForm({ agent }: { agent: User }) {
  const [previewImage, setPreviewImage] = useState<string | null | undefined>(
    agent.image,
  );
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserProfileValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      ...userProfileSchemaDefaultValues,
      name: agent.name ?? "",
      phoneNumber: agent.phoneNumber ?? "",
      description: agent.description ?? "",
      image: agent.image ?? "",
    },
  });

  async function uploadImage(file: File) {
    const { uploadUrl, publicUrl } = await getS3PresignedUrl(
      file.name,
      file.type,
    );

    const resp = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!resp.ok) throw new Error("Failed to upload image");
    return publicUrl;
  }

  async function onSubmit(values: UserProfileValues) {
    startTransition(async () => {
      try {
        const finalValues = { ...values };

        if (previewImage && previewImage.startsWith("blob:") && values.file) {
          finalValues.image = await uploadImage(values.file);
        }

        const res = await updateAgent(agent.id, finalValues);

        if (!res?.success) {
          toast.error(res?.message ?? "Failed to update agent");
          return;
        }

        toast.success("Agent updated successfully!");
      } catch {
        toast.error("Unexpected error");
      }
    });
  }

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);

    form.setValue("image", url);
    form.setValue("file", file);
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
      <Toaster position="top-center" richColors />

      <h1 className="mb-6 text-center text-2xl font-semibold">
        Edit Estate Agent
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="font-medium">Profile Image</label>

          {previewImage ? (
            <Image
              src={previewImage}
              alt="Preview"
              width={100}
              height={100}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-300" />
          )}

          <Input type="file" accept="image/*" onChange={onImageChange} />
        </div>

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Name</FieldLabel>
              <Input {...field} placeholder="Agent name" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="phoneNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Phone Number</FieldLabel>
              <Input {...field} placeholder="+420 720 000 000" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Bio</FieldLabel>
              <Textarea {...field} placeholder="Agent description..." />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button className="mt-4 w-full" disabled={isPending} type="submit">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
