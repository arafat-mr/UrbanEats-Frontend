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

type Category = {
  id: string
  name: string
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PAGE_LIMIT = 10

  const fetchCategories = async (pageNumber: number = 1) => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/categories?page=${pageNumber}&limit=${PAGE_LIMIT}`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Failed to fetch categories')

      const json = await res.json()
      setCategories(json.result.data)
      setTotalPages(json.result.meta.totalPages)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories(page)
  }, [page])

  if (loading) return <p className="p-4 text-center">Loading categories...</p>

  return (
    <div className="p-6 space-y-6 border rounded-md">
      <h2 className="text-2xl font-semibold text-black dark:text-white text-center">
        Manage Categories
      </h2>

      <Table className="bg-white dark:bg-black rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id} className="dark:text-white">
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.id}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onClick={()=>toast.success('Feature coming soon...')} size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button onClick={()=>toast.success('Feature coming soon...')} size="sm" variant="destructive">
                    Delete
                  </Button>
                </div>
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
