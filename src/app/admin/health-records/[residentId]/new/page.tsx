"use client"
import AdminNav from "../../../components/AdminNav"
import Breadcrumb from "../../../components/Breadcrumb"
import HealthRecordForm from "../../../components/HealthRecordForm"
import { useQuery } from "@blitzjs/rpc"
import getResidents from "../../../queries/getResidents"
import { useParams, useRouter } from "next/navigation"

export default function NewHealthRecordPage() {
  const { residentId } = useParams<{ residentId: string }>()
  const [residents] = useQuery(getResidents, null)
  const resident = residents.find((r) => r.id === Number(residentId))
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-16 py-6">
        <Breadcrumb crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Health Records", href: "/admin/health-records" },
          { label: resident ? `${resident.firstName} ${resident.lastName}` : "Resident", href: `/admin/health-records/${residentId}` },
          { label: "Add Record" },
        ]} />
        {resident && (
          <HealthRecordForm
            resident={resident}
            onSuccess={() => router.push(`/admin/health-records/${residentId}`)}
          />
        )}
      </div>
    </div>
  )
}
