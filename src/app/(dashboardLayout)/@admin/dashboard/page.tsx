import { redirect } from 'next/navigation'
import React from 'react'
export const dynamic = "force-dynamic"
export default function AdminDashboard() {
  return redirect('/dashboard/admin-analytics')
}
