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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type OrderItem = {
  mealId: string;
  quantity: number;
  price: number;
  meal?: { name: string }; 
};


type Order = {
  id: string;
  providerId: string;
  deliveryAddress: string;
  totalAmount: number;
  orderStatus: string; 
  orderItems: OrderItem[];
};

export default function Cart() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders/my-orders", {
        credentials: "include",
      });
      const data = await res.json();
      const ordersArray = Array.isArray(data) ? data : data?.data || [];
      setOrders(ordersArray.filter((o: Order) => o.orderStatus === "CART"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddressChange = (orderId: string, value: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, deliveryAddress: value } : o))
    );
  };

  
  const handleQtyChange = (orderId: string, mealId: string, qty: number) => {
    if (qty < 1) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderItems: o.orderItems.map((i) =>
                i.mealId === mealId ? { ...i, quantity: qty } : i
              ),
            }
          : o
      )
    );
  };

 
  const handlePlaceOrder = async (order: Order) => {
    if (!order.deliveryAddress.trim()) {
      toast.error("Delivery address is required");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/orders/place/${order.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryAddress: order.deliveryAddress,
          items: order.orderItems.map((i) => ({ mealId: i.mealId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      toast.success("Order placed successfully");

    
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error placing order");
    }
  };


  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/orders/cancel/${orderId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel order");

      toast.success("Order canceled successfully");

     
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error canceling order");
    }
  };

  if (loading) return <p className="p-4 text-center">Loading cart...</p>;
  if (!orders.length)
    return <p className="p-4 text-center text-gray-500">Your cart is empty.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>

      {orders.map((order) => (
        <Card key={order.id} className="border rounded-xl max-w-6xl">
         <CardHeader>
  <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
    <span className="font-medium">Order #{order.id.slice(0,6)}</span>
    <span
      className={`font-semibold ${
        order.orderStatus === "CART"
          ? "text-green-600"
          : order.orderStatus === "PLACED"
          ? "text-blue-600"
          : order.orderStatus === "PREPARING"
          ? "text-orange-500"
          : order.orderStatus === "READY"
          ? "text-purple-600"
          : order.orderStatus === "DELIVERED"
          ? "text-green-800"
          : order.orderStatus === "CANCELED"
          ? "text-red-600"
          : "text-gray-500"
      }`}
    >
      {order.orderStatus}
    </span>
  </CardTitle>
</CardHeader>

          <CardContent>
            {/* Delivery Address */}
            <div className="mb-2">
              <b>Delivery Address: <span className="text-red-500">*</span></b>
              <Input
                value={order.deliveryAddress}
                onChange={(e) => handleAddressChange(order.id, e.target.value)}
                className="mt-1"
                placeholder="Enter delivery address"
              />
            </div>

            {/* Items */}
            <div className="mt-2 space-y-1">
              <b>Item:</b>
              {order.orderItems.map((item) => (
  <div key={item.mealId} className="flex justify-between items-center gap-2">
    <span>{item.meal?.name || "Unknown Meal"}</span>
    <Input
      type="number"
      min={1}
      value={item.quantity}
      onChange={(e) => handleQtyChange(order.id, item.mealId, Number(e.target.value))}
      className="w-20"
    />
    <span>Total BDT {item.price * item.quantity}</span>
  </div>
))}

            </div>

            {/* Total */}
            <p className="mt-2 font-bold">
              Total Amount: BDT{" "}
              {order.orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)}
            </p>
          </CardContent>

          <CardFooter className="flex gap-2 justify-end">
            <Button variant="destructive" onClick={() => handleCancelOrder(order.id)}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => handlePlaceOrder(order)}>
              Place Order
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
