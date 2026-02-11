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
import CategoryUpdateModal from '@/components/UpdateCategory'


type Category = {
  id: string
  name: string
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const PAGE_LIMIT = 10

  const fetchCategories = async (pageNumber: number = 1) => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://urban-eats-backend.vercel.app/api/admin/categories?page=${pageNumber}&limit=${PAGE_LIMIT}`,
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const res = await fetch(`https://urban-eats-backend.vercel.app/api/admin/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || 'Delete failed')
        return
      }
      toast.success('Category deleted ')
      fetchCategories(page)
    } catch {
      toast.error('Delete failed')
    }
  }

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
                  <Button
                    onClick={() => setSelectedCategory(cat)}
                    size="sm"
                    variant="outline"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(cat.id)}
                    size="sm"
                    variant="destructive"
                  >
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
        <span className="self-center  text-black dark:text-white">
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

      {/* Use your existing update component as modal */}
      {selectedCategory && (
        <CategoryUpdateModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onUpdated={() => fetchCategories(page)}
        />
      )}
    </div>
  )
}
