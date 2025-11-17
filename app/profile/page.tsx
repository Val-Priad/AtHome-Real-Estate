"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { toast, Toaster } from "sonner";
import Image from "next/image";

import {
  userProfileSchema,
  userProfileSchemaDefaultValues,
  UserProfileValues,
} from "@/db/zodObjects";

import { getS3PresignedUrl } from "@/lib/actions/getS3PresignedUrl";
import { getCurrentUser } from "@/lib/actions/user/getCurrentUser";
import { updateUserProfile } from "@/lib/actions/user/updateUserProfile";

export default function Page() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [initialUser, setInitialUser] = useState({
    name: "",
    description: "",
    image: "",
    phoneNumber: "",
  });

  const form = useForm<UserProfileValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: userProfileSchemaDefaultValues,
  });

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) return;

      setInitialUser({
        name: user.name ?? "",
        phoneNumber: user.phoneNumber ?? "",
        description: user.description ?? "",
        image: user.image ?? "",
      });

      form.setValue("name", user.name ?? "");
      form.setValue("phoneNumber", user.phoneNumber ?? "");
      form.setValue("description", user.description ?? "");
      form.setValue("image", user.image ?? "");

      if (user.image) setPreviewImage(user.image);
    }

    load();
  }, [form]);

  async function uploadImageToS3(file: File) {
    try {
      const { uploadUrl, publicUrl } = await getS3PresignedUrl(
        file.name,
        file.type,
      );

      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) throw new Error("S3 upload failed");

      return publicUrl;
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
      throw err;
    }
  }

  async function onSubmit(values: UserProfileValues) {
    startTransition(async () => {
      try {
        const finalValues = { ...values };

        if (previewImage && values.image?.startsWith("blob:")) {
          const file: File | undefined = values.file;
          if (file) {
            const uploadedUrl = await uploadImageToS3(file);
            finalValues.image = uploadedUrl;
          }
        }

        console.log("Final values:", finalValues);

        const result = await updateUserProfile(finalValues);

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        if (!result?.success) {
          toast.error("Something went wrong");
          return;
        }

        toast.success("Profile updated successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile");
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
    <div className="mt-50 flex items-center justify-center">
      <Toaster position="top-center" richColors />

      <div className="w-full max-w-md rounded-2xl bg-red-50 p-6">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Edit Profile
        </h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="mb-2 block font-medium">Profile Image</label>

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

            <Input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="mt-2"
            />

            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <input type="hidden" {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </>
              )}
            />
          </div>

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  placeholder={initialUser.name || "Your Name"}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                <Input
                  id={field.name}
                  placeholder={initialUser.phoneNumber || "+420 720 000 000"}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  id={field.name}
                  placeholder={initialUser.description || "About you..."}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
