"use client"
import AdminNav from "../../components/AdminNav"
import Breadcrumb from "../../components/Breadcrumb"
import ResidentHealthRecords from "../../components/HealthRecords/ResidentHealthRecords"
import BmiTrendChart from "../../components/HealthRecords/BmiTrendChart"
import { useQuery } from "@blitzjs/rpc"
import getResidents from "../../queries/getResidents"
import getRecords from "../../queries/getRecords"
import { useParams } from "next/navigation"
import Link from "next/link"
import PrintIcon from "@mui/icons-material/Print"

export default function ResidentRecordsPage() {
  const { residentId } = useParams<{ residentId: string }>()
  const [residents] = useQuery(getResidents, null)
  const [allRecords] = useQuery(getRecords, null)
  const resident = residents.find((r) => r.id === Number(residentId))
  const residentRecords = allRecords.filter(r => r.residentId === Number(residentId))

  const fullName = resident
    ? `${resident.firstName} ${resident.middleName ? resident.middleName + " " : ""}${resident.lastName}`
    : "Records"

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-16 py-6">
        <Breadcrumb crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Health Records", href: "/admin/health-records" },
          { label: fullName },
        ]} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-700 capitalize">{fullName}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{resident?.address} &mdash; {resident?.gender}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="border border-slate-300 hover:bg-slate-100 text-slate-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
              <PrintIcon fontSize="small" /> Print
            </button>
            <Link
              href={`/admin/health-records/${residentId}/new`}
              className="bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              + Add Record
            </Link>
          </div>
        </div>

        <BmiTrendChart records={residentRecords} />
        {resident && <ResidentHealthRecords resident={resident} />}
      </div>
    </div>
  )
}
