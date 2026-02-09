"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className=" container rounded-md mx-auto  text-gray-800 dark:text-gray-200 py-12">
      <div className=" px-10 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div className="space-y-4 px-5">
          <h2 className="text-2xl font-bold">
            <span className="text-yellow-400">Urban</span>
            <span className="text-teal-400">Eats</span>
          </h2>
          <p className="text-sm md:text-base">
            Taste the freshness every day! Premium meals delivered straight to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:text-yellow-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/meals" className="hover:text-yellow-400 transition">
                Meals
              </Link>
            </li>
            <li>
              <Link href="/hot-deals" className="hover:text-yellow-400 transition">
                Hot Deals
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-yellow-400 transition">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
          <p className="text-sm md:text-base">support@urbaneats.com</p>
          <p className="text-sm md:text-base">+971 50 123 4567</p>

          <div className="flex space-x-4 mt-2">
            <Button size="sm" variant="outline" className="px-3 py-1">
              Facebook
            </Button>
            <Button size="sm" variant="outline" className="px-3 py-1">
              Instagram
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-6 text-center text-sm md:text-base">
        &copy; {new Date().getFullYear()} UrbanEats. All rights reserved.
      </div>
    </footer>
  );
}
