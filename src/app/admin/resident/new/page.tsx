"use client"
import AdminNav from "../../components/AdminNav"
import Breadcrumb from "../../components/Breadcrumb"
import ResidentForm from "../../components/ResidentsForm"

export default function NewResidentPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-16 py-6">
        <Breadcrumb crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Residents", href: "/admin/resident" },
          { label: "Add Resident" },
        ]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-6 py-5">
            <h1 className="text-white font-bold text-xl">Add New Resident</h1>
            <p className="text-slate-300 text-xs mt-0.5">Fill in the details below</p>
          </div>
          <div className="p-6">
            <ResidentForm resident={null} />
          </div>
        </div>
      </div>
    </div>
  )
}
