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

type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'ACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt: string
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = async (pageNumber: number) => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://urban-eats-backend.vercel.app/api/admin/users?page=${pageNumber}&limit=10`,
        {
          credentials: 'include',
        }
      )

      if (!res.ok) throw new Error('Failed to fetch users')

      const json = await res.json()
      setUsers(json.result.data)
      setTotalPages(json.result.meta.totalPages)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(page)
  }, [page])

  const toggleStatus = async (id: string, currentStatus: string, role: string) => {
    if (role === 'ADMIN') {
      toast.error("Admin's status cannot be changed")
      return
    }

    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    try {
      const res = await fetch(`https://urban-eats-backend.vercel.app/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to update status')
      toast.success('Status updated')
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus as any } : u))
      )
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status')
    }
  }

  if (loading) return <p className="p-4 text-center">Loading users...</p>

  return (
    <div className="p-6 space-y-6 border rounded-md">
      <h2 className="text-2xl font-semibold text-black dark:text-white text-center">Users</h2>

      <Table className="bg-white dark:bg-black rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="dark:text-white">
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    user.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}
                >
                  {user.status}
                </span>
              </TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleStatus(user.id, user.status, user.role)}
                  disabled={user.role === 'ADMIN'}
                >
                  {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
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
