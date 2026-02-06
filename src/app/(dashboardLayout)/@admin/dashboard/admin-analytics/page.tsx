"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// Dynamically import ApexCharts to prevent SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type AnalyticsData = {
  totalOrders: number;
  totalUsers: number;
  totalProviders: number;
};

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/analytics/admin-analytics",
          {
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Failed to fetch analytics");

        const json = await res.json();
        setData(json.data || json);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <p className="p-4 text-center">Loading analytics...</p>;
  }

  if (!data) {
    return (
      <p className="p-4 text-center text-red-500">No analytics data found</p>
    );
  }

const chartOptions = {
  chart: {
    id: "admin-analytics",
    toolbar: { show: false },
    background: "transparent",
  },
  xaxis: {
    categories: ["Orders", "Users", "Providers"],
    labels: {
      style: {
        colors: [
          document.documentElement.classList.contains("dark") ? "#fff" : "#000",
          document.documentElement.classList.contains("dark") ? "#fff" : "#000",
          document.documentElement.classList.contains("dark") ? "#fff" : "#000",
        ],
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: [document.documentElement.classList.contains("dark") ? "#fff" : "#000"],
      },
    },
  },
  dataLabels: {
    enabled: true,
    style: { colors: ["#ffffff"] }, // bar labels
  },
  colors: ["#3b82f6", "#10b981", "#f59e0b"], // bars
};


  const chartSeries = [
    {
      name: "Count",
      data: [data.totalOrders, data.totalUsers, data.totalProviders],
    },
  ];

  return (
    <div className="p-6 max-w-4xl  space-y-8">
      <h2 className="text-2xl font-semibold text-center">Admin Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-white">Total Orders</p>
          <p className="text-xl font-bold">{data.totalOrders}</p>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-white">Total Users</p>
          <p className="text-xl font-bold">{data.totalUsers}</p>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-white">Total Providers</p>
          <p className="text-xl font-bold">{data.totalProviders}</p>
        </div>
      </div>

      {/* Apex Bar Chart */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
          
        />
      </div>
    </div>
  );
}
