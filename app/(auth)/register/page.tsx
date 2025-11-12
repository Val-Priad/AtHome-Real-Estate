"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { authSchema, authSchemaDefault } from "@/db/zodObjects";
import { registerUser } from "@/lib/api/register";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: authSchemaDefault,
  });

  type RegisterFormValues = z.infer<typeof authSchema>;

  async function onSubmit(values: RegisterFormValues) {
    try {
      await toast.promise(registerUser(values), {
        loading: "Registering...",
        success: "Check your email for confirmation link!",
        error: (err) =>
          err instanceof Error
            ? err.message
            : "Registration failed, try again later.",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred.";
      toast.error(message);
    }
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <h1 className="mb-6 text-center text-2xl font-semibold">Register</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                id={field.name}
                type="email"
                placeholder="you@example.com"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <div className="relative">
                <Input
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...field}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" className="mt-4 w-full">
          Continue
        </Button>
      </form>
    </>
  );
}
