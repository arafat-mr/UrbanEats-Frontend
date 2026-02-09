"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Banner() {
     
  const { theme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <section className="relative w-full flex justify-center py-10 md:py-20 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-6 md:px-16">
        
        <motion.div
          className="flex-1 mb-10 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Urban
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400">
              Eats
            </span>
          </h1>

          <motion.p
            className="text-lg md:text-xl mb-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Taste the freshness every day! Explore our premium meals and discover deliciousness at your doorstep.
          </motion.p>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href={'/meals'}
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-xl transition-transform transform hover:scale-105"
             
            >
              Explore Now
            </Link>
          </motion.div>
        </motion.div>

        
        <div className="flex-1 flex justify-center md:justify-end">
          <div
            className="w-80 h-80 md:w-[30rem] md:h-[30rem] bg-cover bg-center rounded-2xl shadow-2xl"
            style={{ backgroundImage: `url(/banner.jpg)` }}
          ></div>
        </div>
      </div>
    </section>
  );
}
