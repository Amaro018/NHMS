"use client"
import React from "react"
import Sidebar from "./components/Sidebar"
import { useQuery } from "@blitzjs/rpc"
import AdminDashboard from "./components/AdminDashboard"

export default function Dashboard() {
  // Use useQuery to fetch the resident count
  return (
    <div className="flex flex-col px-16 text-black bg-white dark:text-white dark:bg-black h-screen">
      <Sidebar />
      <AdminDashboard />
    </div>
  )
}
