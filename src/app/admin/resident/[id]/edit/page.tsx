"use client"
import AdminNav from "../../../components/AdminNav"
import Breadcrumb from "../../../components/Breadcrumb"
import ResidentForm from "../../../components/ResidentsForm"
import { useQuery } from "@blitzjs/rpc"
import getResidents from "../../../queries/getResidents"
import { useParams } from "next/navigation"

function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 bg-slate-100 rounded-lg" />
      ))}
    </div>
  )
}

export default function EditResidentPage() {
  const { id } = useParams<{ id: string }>()
  const [residents] = useQuery(getResidents, null)
  const resident = residents.find((r) => r.id === Number(id))

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-16 py-6">
        <Breadcrumb crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Residents", href: "/admin/resident" },
          { label: resident ? `${resident.firstName} ${resident.lastName}` : "Edit" },
        ]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-6 py-5">
            <h1 className="text-white font-bold text-xl">Edit Resident</h1>
            <p className="text-slate-300 text-xs mt-0.5 capitalize">
              {resident ? `${resident.firstName} ${resident.lastName}` : "Loading..."}
            </p>
          </div>
          <div className="p-6">
            {resident ? <ResidentForm resident={resident} /> : <Skeleton />}
          </div>
        </div>
      </div>
    </div>
  )
}
