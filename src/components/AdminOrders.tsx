'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

type OrderItem = {
  id: string
  orderId: string
  quantity: number
  price: number
  meal: { id: string; name: string }
}

type User = {
  id: string
  name: string
  email: string
}

type Order = {
  id: string
  customerId: string
  providerId: string
  totalAmount: number
  paymentMethod: string
  orderStatus: 'PLACED' | 'READY' | 'DELIVERED' | 'CART'
  deliveryAddress: string
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
  user: User
}

const STATUS_OPTIONS: Order['orderStatus'][] = ['PLACED', 'READY', 'DELIVERED']

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchOrders = async (pageNumber: number = 1) => {
    setLoading(true)
    try {
      const res = await fetch(
        // `https://urban-eats-backend.vercel.app/api/admin/orders?page=${pageNumber}&limit=10`,
        `https://urban-eats-backend.vercel.app/api/admin/orders?page=${pageNumber}&limit=10`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Failed to fetch orders')

      const json = await res.json()

      const filteredOrders = json.result.data.filter(
        (o: Order) => o.orderStatus !== 'CART'
      )

      setOrders(filteredOrders)
      setTotalPages(json.result.meta.totalPages)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(page)
  }, [page])

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: Order['orderStatus']
  ) => {
    try {
      const res = await fetch(
        `https://urban-eats-backend.vercel.app/api/providers/orders/update/${orderId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update order')

      toast.success('Order status updated')

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      )
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to update order')
    }
  }

  if (loading) return <p className="p-4 text-center">Loading orders...</p>

  return (
    <div className="p-6 space-y-6 border rounded-md">
      <h2 className="text-2xl font-semibold text-black dark:text-white text-center">
        Orders
      </h2>

      <Table className="bg-white dark:bg-black rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Items</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="dark:text-white">
              <TableCell>{order.id.slice(0,4)}</TableCell>

              <TableCell>
                {order.user.name} <br />
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {order.user.email}
                </span>
              </TableCell>

              <TableCell>BDT {order.totalAmount}</TableCell>

              <TableCell>{order.paymentMethod}</TableCell>

              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    order.orderStatus === 'READY'
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : order.orderStatus === 'PLACED'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      : order.orderStatus === 'DELIVERED'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                      : ''
                  }`}
                >
                  {order.orderStatus}
                </span>
              </TableCell>
               {/* NEW ACTION FIELD */}
              <TableCell>
                <select
                  className="border rounded px-2 py-1 text-sm dark:bg-black"
                  defaultValue=""
                  onChange={(e) =>
                    handleStatusUpdate(
                      order.id,
                      e.target.value as Order['orderStatus']
                    )
                  }
                >
                  <option value="" disabled>
                    Update status
                  </option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </TableCell>

              <TableCell>
                {new Date(order.createdAt).toLocaleString()}
              </TableCell>

              <TableCell>
                {order.orderItems.map((item) => (
                  <div key={item.id} className="text-sm">
                    <span className="font-semibold">{item.meal.name}</span> ×{' '}
                    {item.quantity} | Price: BDT {item.price}
                  </div>
                ))}
              </TableCell>

             
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          size="sm"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="self-center text-black dark:text-white">
          Page {page} of {totalPages}
        </span>
        <Button
          size="sm"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
