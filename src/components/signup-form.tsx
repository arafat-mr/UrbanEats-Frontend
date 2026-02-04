"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

import { useForm } from "@tanstack/react-form";
import { redirect } from "next/navigation";

import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  name: z.string().min(1, "This field is required"),
  password: z.string().min(8, "Must be at least 8 characters"),
  email: z.string().email("Invalid email "),
  role: z.string().min(7, "Please select a role"),

  phone: z.string(),
  image: z.string(),
});
export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [imageUploading, setImageUploading] = useState(false);
      const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "", 
      role: "",
      phone: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Submit clicked", value);


      console.log("👉 Call Better Auth signup API here");
      const toastId = toast.loading("Creating user");
      try {
        const { data, error } = await authClient.signUp.email(value);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("User created successfully", { id: toastId });
        if (value.role === "PROVIDER") {
          const providerToast = toast.loading("Creating provider profile...");

          try {

             const res = await fetch(`http://localhost:5000/api/providers`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: data.user.id,
              }),
            });
            const providerData = await res.json();
            if (!res.ok) {
              toast.error(providerData?.message || "Provider creation failed", {
                id: providerToast,
              });
              return;
            }

            toast.success("Provider profile created ", { id: providerToast });
          
          } catch (error) {
           
        }

      }
      router.push("/");
      } catch (error) {
        toast.error("Internal server error", { id: toastId });
      }

    
    },
  });

  
  const handleImageUpload = async (file: File) => {
    setImageUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMBB_API}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    setImageUploading(false);

    return data?.data?.url; // image URL
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Name */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Email */}
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      type="email"
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Password */}
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      type="password"
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Image Upload */}
            <form.Field
              name="image"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Profile Image</FieldLabel>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const url = await handleImageUpload(file);
                        field.handleChange(url);
                      }}
                    />

                    {imageUploading && (
                      <p className="text-sm text-muted-foreground">
                        Uploading image...
                      </p>
                    )}

                    {field.state.value && (
                      <p className="text-sm text-green-600">Image uploaded</p>
                    )}
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Role Select */}
            <form.Field
              name="role"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Role</FieldLabel>
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select role</option>
                      <option value="CUSTOMER">Customer</option>
                      <option value="PROVIDER">Provider</option>
                    </select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Phone */}
            <form.Field
              name="phone"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Phone</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button form="signup-form" type="submit" disabled={imageUploading}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
