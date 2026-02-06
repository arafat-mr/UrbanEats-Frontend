"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

type AnalyticsData = {
  totalOrders: number;
  successfulOrders: number;
  successPercentage: number;
};

export default function CustomerAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/analytics/customer-analytics",
        { credentials: "include" }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch analytics");

      setData(result.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <p className="p-4 text-center">Loading analytics...</p>;
  if (!data)
    return <p className="p-4 text-center text-gray-500">No analytics data available</p>;

  const chartSeries = [
    data.successfulOrders,
    data.totalOrders - data.successfulOrders,
  ];

  const chartOptions : any = {
    chart: {
      type: "donut",
      toolbar: { show: false },
    },
    labels: ["Successful Orders", "Cancelled Orders"],
    theme: {
      mode: "light",
      palette: "palette2",
    },
    colors: ["#22c55e", "#ef4444"], // green, red
    legend: {
      position: "bottom" as const,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { width: 300 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="p-6 space-y-6 ">
      <h1 className="text-3xl font-bold text-center">Customer Analytics 📊</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border rounded-xl">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-2xl font-bold">
            {data.totalOrders}
          </CardContent>
        </Card>

        <Card className="border rounded-xl">
          <CardHeader>
            <CardTitle>Successful Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-2xl font-bold">
            {data.successfulOrders} {" "}
            <span className="text-sm text-muted-foreground">
              ({data.successPercentage}%)
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Donut Chart */}
      <Card className="border rounded-xl">
        <CardHeader>
          <CardTitle>Order Success vs Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <ApexCharts options={chartOptions} series={chartSeries} type="donut" height={320} />
        </CardContent>
      </Card>
    </div>
  );
}
