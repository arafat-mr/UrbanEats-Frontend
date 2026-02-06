"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type OrderItem = {
  mealId: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  providerId: string;
  deliveryAddress: string;
  totalAmount: number;
  orderStatus: string; 
  orderItems: OrderItem[];
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders/my-orders", {
        credentials: "include",
      });
      const data = await res.json();
      const ordersArray = Array.isArray(data) ? data : data?.data || [];
      setOrders(ordersArray);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/orders/cancel/${orderId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel order");

      toast.success("Order canceled successfully");
      // update order locally
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, orderStatus: "CANCELED" } : o
        )
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error canceling order");
    }
  };

  if (loading) return <p className="p-4 text-center">Loading orders...</p>;
  if (!orders.length)
    return <p className="p-4 text-center text-gray-500">No orders found.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.map((order) => (
        <Card key={order.id} className="border rounded-xl">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order #{order.id}</span>
             <span
  className={`font-semibold ${
    order.orderStatus === "PLACED"
      ? "text-green-600"
      : order.orderStatus === "PREPARING"
      ? "text-yellow-500"
      : order.orderStatus === "READY"
      ? "text-blue-500"
      : order.orderStatus === "DELIVERED"
      ? "text-gray-500"
      : order.orderStatus === "CANCELED"
      ? "text-red-500"
      : "text-gray-500"
  }`}
>
  {order.orderStatus}
</span>

            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>
              <b>Delivery Address:</b> {order.deliveryAddress}
            </p>
            <p>
              <b>Total Amount:</b> BDT{" "}
              {order.orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)}
            </p>

            <div className="mt-2 space-y-1">
              <b>Items:</b>
              {order.orderItems.map((item) => (
                <div key={item.mealId} className="flex justify-between items-center">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>Total BDT {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 justify-end">
            {order.orderStatus === "PLACED" && (
              <Button
                variant="destructive"
                onClick={() => handleCancelOrder(order.id)}
              >
                Cancel
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
