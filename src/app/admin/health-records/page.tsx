"use client"
import AdminNav from "../components/AdminNav"
import Breadcrumb from "../components/Breadcrumb"
import HealthRecordList from "../components/HealthRecordList"

export default function HealthRecordsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-16 py-4">
        <Breadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Health Records" }]} />
        <h1 className="text-xl font-bold text-slate-700 mb-4">Health Records</h1>
        <HealthRecordList />
      </div>
    </div>
  )
}
