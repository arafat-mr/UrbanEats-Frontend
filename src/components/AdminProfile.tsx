"use client";


import { UpdateProfileModal } from "@/components/UpdateProviderProfile";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  phone?: string;
};

export default function AdminProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("https://urban-eats-backend.vercel.app/api/auth/get-session", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setUser(data.data || data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) {
    return <p className="p-4 text-center">Loading profile...</p>;
  }

  if (!user) {
    return <p className="p-4 text-center text-red-500">No user data found</p>;
  }

  return (
    <div className=" p-6 max-w-6xl mx-auto rounded-lg border bg-background">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Admin Profile
      </h2>

      {/* Responsive layout */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
        {/* Image first on small devices */}
        {user.image && (
          <img
            src={user.image}
            alt="Profile"
            className="h-40 w-40 md:h-48 md:w-48 rounded-full object-cover border"
          />
        )}

        {/* Info */}
        <div className="space-y-2 text-center md:text-left">
          <p>
            <b>Name:</b> {user.name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Role:</b> {user.role}
          </p>
          {user.phone && (
            <p>
              <b>Phone:</b> {user.phone}
            </p>
          )}

          {/* Update button */}
          <button
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Update Profile
          </button>

          {isModalOpen && user && (
  <UpdateProfileModal
    user={user}
    onClose={() => setIsModalOpen(false)}
    onUpdated={async () => {
      // Refetch the profile after update
      try {
        const res = await fetch("https://urban-eats-backend.vercel.app/api/auth/get-session", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setUser(data.data || data);
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error("Failed to refresh profile");
      }
    }}
  />
)}
        </div>
      </div>
    </div>
  );
}
