'use client';

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OrderItem = {
  mealId: string;
  quantity: number;
  price: number;
  meal: {
    id: string;
    name: string;
  };
};

type Order = {
  id: string;
  customerId: string;
  user: {
    id: string;
    name: string;
  };
  deliveryAddress: string;
  totalAmount: number;
  orderStatus: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  orderItems: OrderItem[];
};

const STATUS_OPTIONS: Order["orderStatus"][] = ["PREPARING", "READY", "DELIVERED", "CANCELLED"];

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/providers/my-orders", {
        credentials: "include",
      });
      const data = await res.json();
      const ordersArray: Order[] = Array.isArray(data) ? data : data?.data || [];

      // Filter out CART orders
      const filteredOrders = ordersArray.filter((order) => order.orderStatus !== "CART");

      setOrders(filteredOrders);
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

  const handleStatusUpdate = async (orderId: string, newStatus: Order["orderStatus"]) => {
    try {
      const res = await fetch(`http://localhost:5000/api/providers/orders/update/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update order");

      toast.success("Order status updated");

      // Update locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update order");
    }
  };

  if (loading) return <p className="p-4 text-center">Loading orders...</p>;
  if (!orders.length)
    return <p className="p-4 text-center text-gray-500">No orders found.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Provider Orders</h1>

      <Table className="bg-white dark:bg-black rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Customer ID</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id.slice(0, 6)}</TableCell>
              <TableCell>{order.user?.name || "N/A"}</TableCell>
              <TableCell>{order.customerId.slice(0, 6)}</TableCell>
              <TableCell>{order.deliveryAddress || "N/A"}</TableCell>
              <TableCell>
                BDT {order.orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)}
              </TableCell>
              <TableCell>
                {order.orderItems.map((item) => (
                  <div key={item.mealId}>
                    {item.meal.name} x {item.quantity}
                  </div>
                ))}
              </TableCell>
              <TableCell>{order.orderStatus}</TableCell>
              <TableCell>
                <Select
                  onValueChange={(value) => handleStatusUpdate(order.id, value as Order["orderStatus"])}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
