"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const categories = [
  { id: "ffffddff", name: "Italian" },
  { id: "ddff", name: "Indian" },
  { id: "assss", name: "Chinese" },
  { id: "ssdddf", name: "Thai" },
  { id: "bgdss", name: "Bengali" },
];

const dietaryOptions = ["HALAL", "VEGETARIAN"];

async function getMe() {
  const res = await fetch("http://localhost:5000/api/me", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return res.json(); // { id, email, role }
}

export default function AddMealForm() {
  const [imageUploading, setImageUploading] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: "",
      categoryId: "",
      dietaryTag: "", // single string
    },

    onSubmit: async ({ value }) => {
      if (
        !value.name ||
        !value.description ||
        !value.price ||
        !value.image ||
        !value.categoryId
      ) {

        console.log(value);
        
        toast.error("Please fill all required fields");
        return;
      }

      let me;
      try {
        me = await getMe();
      } catch {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      const payload = {
        providerId: me.id,
        name: value.name,
        description: value.description,
        price: Number(value.price),
        image: value.image,
        categoryId: value.categoryId,
        dietaryTags: value.dietaryTag ? [value.dietaryTag] : [],
      };

      console.log("Final Payload 👉", payload);
 
      const toastId = toast.loading("Creating Meal...");
      try {
        const res = await fetch("http://localhost:5000/api/provider/meals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed");

        toast.success("Meal created successfully", { id: toastId });
        form.reset()
       
      } catch (err: any) {
        toast.error(err.message || "Failed to create meal", { id: toastId });
      }
    },
  });

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMBB_API}`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    setImageUploading(false);
    return data?.data?.url;
  };

  return (
    <Card className="mt-10 ">
      <CardHeader>
        <CardTitle>Add Meal</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          id="add-meal-form"
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
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            {/* Image */}
            <form.Field name="image">
              {(field) => (
                <Field>
                  <FieldLabel>Meal Image</FieldLabel>
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
                  {imageUploading && <p className="text-sm">Uploading...</p>}
                  {field.state.value && (
                    <p className="text-sm text-green-600">Image uploaded</p>
                  )}
                </Field>
              )}
            </form.Field>

            {/* Category */}
            <form.Field name="categoryId">
              {(field) => (
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
                  >
                    <option className="dark:bg-gray-700 dark:text-white" value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </form.Field>

            {/* Dietary */}
            <form.Field name="dietaryTag">
              {(field) => (
                <Field>
                  <FieldLabel>Dietary Tag</FieldLabel>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select</option>
                    {dietaryOptions.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button type="submit" form="add-meal-form" disabled={imageUploading}>
          Create Meal
        </Button>
      </CardFooter>
    </Card>
  );
}
