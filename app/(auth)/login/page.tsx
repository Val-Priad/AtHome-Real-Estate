"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { toast, Toaster } from "sonner";
import { authSchema, authSchemaDefault } from "@/db/zodObjects";
import { useRouter } from "next/navigation";
import { doCredentialLogIn } from "@/lib/actions/user/authActions";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  type LoginFormValues = z.infer<typeof authSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: authSchemaDefault,
  });

  async function onSubmit(values: LoginFormValues) {
    startTransition(async () => {
      const result = await doCredentialLogIn(values.email, values.password);

      if (result.success) {
        toast.success("Logged in successfully!");
        router.replace("/");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <h1 className="mb-6 text-center text-2xl font-semibold">Login</h1>

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
        <Link
          href={"/register"}
          className="text-brand-6 -mt-2.5 flex items-center justify-center text-center text-sm tracking-wide italic underline"
        >
          register
        </Link>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Continue"}
        </Button>
      </form>
    </>
  );
}
