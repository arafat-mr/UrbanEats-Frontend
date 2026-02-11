"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Analytics = {
  totalDeliveredOrders: number;
  totalRevenue: number;
  totalItemsSold: number;
};

export default function ProviderAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, resolvedTheme } = useTheme();

  const isDark = (resolvedTheme || theme) === "dark";

 
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("https://urban-eats-backend.vercel.app/analytics/provider-analytics", {
          credentials: "include",
        });
        const json = await res.json();
        setAnalytics(json?.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load provider analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  
  const revenueSeries = useMemo(() => {
    if (!analytics) return [{ name: "Revenue", data: [] }];
    return [{ name: "Revenue", data: [analytics.totalRevenue] }];
  }, [analytics]);

  const ordersSeries = useMemo(() => {
    if (!analytics) return [{ name: "Orders", data: [] }];
    return [{ name: "Orders", data: [analytics.totalDeliveredOrders] }];
  }, [analytics]);

  const commonOptions: any = useMemo(
    () => ({
      theme: { mode: isDark ? "dark" : "light" },
      grid: { borderColor: isDark ? "#2a2a2a" : "#e5e7eb" },
      tooltip: { theme: isDark ? "dark" : "light" },
    }),
    [isDark]
  );

  if (loading) return <p className="p-4 text-center">Loading analytics...</p>;
  if (!analytics)
    return <p className="p-4 text-center text-gray-500">No analytics found.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Provider Analytics</h1>

   
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Delivered Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {analytics.totalDeliveredOrders}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            BDT {analytics.totalRevenue}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Items Sold</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {analytics.totalItemsSold}
          </CardContent>
        </Card>
      </div>

     
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
    <Chart
  options={{
    ...commonOptions,
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth", 
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    markers: { size: 6 },
    dataLabels: { enabled: false },
    xaxis: { categories: ["Total Revenue"] },
    tooltip: { theme: isDark ? "dark" : "light" },
  }}
  series={revenueSeries}
  type="bar"
  height={280}
/>


        </CardContent>
      </Card>

     
      <Card>
        <CardHeader>
          <CardTitle>Delivered Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={{
              ...commonOptions,
              chart: { type: "bar", toolbar: { show: false } },
              plotOptions: { bar: { borderRadius: 8, columnWidth: "45%" } },
              dataLabels: { enabled: false },
              xaxis: { categories: ["Delivered Orders"] },
            }}
            series={ordersSeries}
            type="bar"
            height={260}
          />
        </CardContent>
      </Card>

    
      <Card>
        <CardHeader>
          <CardTitle>Items Sold Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Chart
            options={{
              ...commonOptions,
              labels: ["Items Sold"],
              legend: { position: "bottom" },
              dataLabels: { enabled: true, style: { fontSize: "14px" } },
            }}
            series={[analytics.totalItemsSold]}
            type="donut"
            height={260}
          />
        </CardContent>
      </Card>
    </div>
  );
}
