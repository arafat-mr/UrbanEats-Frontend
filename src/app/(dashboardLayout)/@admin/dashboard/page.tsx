import { redirect } from 'next/navigation'
import React from 'react'

export default function AdminDashboard() {
  return redirect('/dashboard/admin-analytics')
}
