"use client";

import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/db/types";
import { getCurrentUser } from "@/lib/actions/user/getCurrentUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { sendEmailToAgent } from "@/lib/actions/sendEmailToAgent";

const WriteToAgentSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number"),
  description: z.string().min(25).max(500),
});

type WriteToAgentValues = z.infer<typeof WriteToAgentSchema>;

function WriteToAgent({
  agentEmail,
  estateId,
  estateTitle,
}: {
  agentEmail: string;
  estateId: number;
  estateTitle: string;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isSending, setIsSending] = useState(false);

  const form = useForm<WriteToAgentValues>({
    resolver: zodResolver(WriteToAgentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      description: "",
    },
  });

  useEffect(() => {
    const loadUser = async () => {
      const u = await getCurrentUser();
      setUser(u);

      if (u) {
        form.reset({
          name: u.name ?? "",
          email: u.email ?? "",
          phone: u.phoneNumber ?? "",
          description: "",
        });
      }
    };

    loadUser();
  }, [form]);

  async function onSubmit(values: WriteToAgentValues) {
    setIsSending(true);
    toast.promise(
      sendEmailToAgent(agentEmail, {
        ...values,
        estateTitle: estateTitle,
        estateUrl: `${process.env.NEXT_PUBLIC_APP_URL}/estate/${estateId}`,
      }),
      {
        loading: "Sending your message…",
        success: "Message successfully sent to the agent!",
        error: "Failed to send the message. Try again later.",
      },
    );
    setIsSending(false);
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      <span className="text-brand-9 mb-1 block text-lg">Fill the Form</span>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-6">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input id={field.name} placeholder="Your Name" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input id={field.name} placeholder="Your Email" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                <Input id={field.name} placeholder="Your Phone" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
              <Textarea id={field.name} placeholder="About you..." {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button disabled={isSending} type="submit">
          Send Message
        </Button>
      </form>
    </div>
  );
}

export default WriteToAgent;
