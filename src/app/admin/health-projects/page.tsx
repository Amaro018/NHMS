"use client"
import AdminNav from "../components/AdminNav"
import Breadcrumb from "../components/Breadcrumb"
import HealthProjectList from "../components/HealthProjects/HealthProjectList"
import { useRouter } from "next/navigation"

export default function HealthProjects() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-16 py-4">
        <Breadcrumb crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Health Projects" },
        ]} />
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-700">Health Projects</h1>
          <button
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-md shadow transition-colors text-sm"
            onClick={() => router.push("/admin/health-projects/new")}
          >
            + Add Project
          </button>
        </div>
        <HealthProjectList />
      </div>
    </div>
  )
}
