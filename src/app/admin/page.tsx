"use client"
import AdminNav from "./components/AdminNav"
import AdminDashboard from "./components/AdminDashboard"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-16 py-4">
        <h1 className="text-xl font-bold text-slate-700 mb-4">Dashboard</h1>
        <AdminDashboard />
      </div>
    </div>
  )
}
