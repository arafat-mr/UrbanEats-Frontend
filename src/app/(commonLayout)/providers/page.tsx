"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface Provider {
  id: string;
  restaurantName: string;
  description?: string | null;
  user: {
    name: string;
    email: string;
    image:string
  };
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProviders = async () => {
    try {
      const res = await fetch("https://urban-eats-backend.vercel.app/api/providers", {
        credentials: "include", // if you have cookies/auth
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch providers");
      setProviders(data.data || []); // adjust according to your backend response
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  if (loading) return <p className="p-10 text-center">Loading providers...</p>;
  if (!providers.length)
    return (
      <p className="p-10 text-center text-gray-500">No providers found.</p>
    );

  return (
    <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => (
        <Card
          key={provider.id}
          className="border rounded-xl shadow hover:shadow-lg transition"
        >
          <CardHeader className="flex flex-col items-center gap-2">
            <img
              src={provider.user?.image} // replace with provider image if exists
              alt={provider.user.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <CardTitle className="text-lg font-bold text-center">
              {provider.user.name}
            </CardTitle>
          </CardHeader>

          <CardFooter className="flex justify-center">
           <Button asChild>
  <Link href={`/providers/${provider.id}`}>View Details</Link>
</Button>

          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
