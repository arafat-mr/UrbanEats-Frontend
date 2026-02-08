"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

type Props = {
  meal: {
    id?: string;
    name: string;
    description?: string;
    image?: string;
    price?: number;
    isAvailable?: boolean;
  };
  onClose: () => void;
  onUpdated: () => void;
};

export function MealUpdate({ meal, onClose, onUpdated }: Props) {
  const [imageUploading, setImageUploading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: meal.name || "",
      description: meal.description || "",
      price: meal.price || 0,
      image: meal.image || "",
      isAvailable: meal.isAvailable ?? true,
    },

    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Updating meal...");
      try {
        const res = await fetch(
          `http://localhost:5000/api/provider/meals/${meal.id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(value),
          },
        );

        const data = await res.json();
        console.log(data);

        if (!res.ok) {
          toast.error(data?.message || "Update failed", { id: toastId });
          return;
        }

        toast.success("Meal updated successfully", { id: toastId });
        onUpdated();
        onClose();
      } catch (err) {
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

    return data?.data?.url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Update Meal</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            id="update-meal"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {/* Name */}
              <form.Field name="name">
                {(field) => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              {/* Description */}
              <form.Field name="description">
                {(field) => (
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              {/* Price */}
              <form.Field name="price">
                {(field) => (
                  <Field>
                    <FieldLabel>Price</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                         value={field.state.value === 0 ? "" : field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      placeholder="Enter meal price"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              {/* Image */}
              <form.Field name="image">
                {(field) => (
                  <Field>
                    <FieldLabel> Meal Image</FieldLabel>
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

                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button form="update-meal" type="submit" disabled={imageUploading}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
