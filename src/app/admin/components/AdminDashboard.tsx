"use client"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getResidentCount from "./../queries/getResidentCount"
import getHealthRecordCount from "./../queries/getHealthRecordCount"
import getHealthProjectCount from "./../queries/getHealthProjectCount"
import getResidents from "./../queries/getResidents"
import getRecords from "./../queries/getRecords"
import getHealthProjects from "./../queries/getHealthProjects"
import MonthlyTrendChart from "./MonthlyTrendChart"
import { Chip } from "@mui/material"
import "boxicons/css/boxicons.min.css"

function calcAge(birthDate: Date) {
  const today = new Date()
  const bd = new Date(birthDate)
  let age = today.getFullYear() - bd.getFullYear()
  if (
    today.getMonth() < bd.getMonth() ||
    (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())
  )
    age--
  return age
}

const statusColor: Record<string, string> = {
  Normal: "#00e676",
  "Normal weight": "#00e676",
  Hypotension: "#ff9800",
  Elevated: "#ff9800",
  Underweight: "#ff9800",
  Overweight: "#fca5a5",
  "Hypertension Stage 1": "#fca5a5",
  "Hypertension Stage 2": "#ff5252",
  "Hypertensive Crisis": "#7f1d1d",
  "Class I Obese": "#fca5a5",
  "Class II Obese": "#ef4444",
  "Class III Obese": "#7f1d1d",
  "All Residents": "#22d3ee",
}

export default function AdminDashboard() {
  const [residentCount] = useQuery(getResidentCount, {})
  const [healthRecordCount] = useQuery(getHealthRecordCount, {})
  const [healthProjectCount] = useQuery(getHealthProjectCount, {})
  const [residents] = useQuery(getResidents, null)
  const [records] = useQuery(getRecords, null)
  const [healthProjects] = useQuery(getHealthProjects, null)

  const recentResidents = residents.slice(0, 5)
  const recentRecords = records.slice(0, 5)
  const recentProjects = healthProjects.slice(0, 4)

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="flex flex-col sm:flex-row gap-4">
        {[
          { label: "Residents", sub: "Total registered", icon: "bx bxs-user-detail", count: residentCount, href: "/admin/resident" },
          { label: "Health Records", sub: "Total records", icon: "bx bx-heart", count: healthRecordCount, href: "/admin/health-records" },
          { label: "Health Projects", sub: "Total projects", icon: "bx bx-check-shield", count: healthProjectCount, href: "/admin/health-projects" },
        ].map((card) => (
          <Link key={card.label} href={card.href} className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-row justify-between items-center hover:shadow-md transition-shadow cursor-pointer">
              <div>
                <p className="text-base font-semibold text-slate-700">{card.label}</p>
                <p className="text-slate-400 text-sm">{card.sub}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <i className={`${card.icon} text-2xl text-slate-400`} />
                <p className="text-4xl font-bold text-slate-700">{card.count}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom two-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Residents */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <i className="bx bxs-user-detail text-lg text-slate-400" /> Recent Residents
            </h2>
            <Link href="/admin/resident" className="text-xs text-slate-500 hover:text-slate-700">
              View all →
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Age</th>
                <th className="px-4 py-2 text-left">Purok</th>
                <th className="px-4 py-2 text-left">Gender</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentResidents.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No residents yet</td></tr>
              ) : recentResidents.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium capitalize">{r.lastName}, {r.firstName}</td>
                  <td className="px-4 py-2 text-slate-500">{calcAge(r.birthDate)}</td>
                  <td className="px-4 py-2 text-slate-500">{r.address}</td>
                  <td className="px-4 py-2 text-slate-500">{r.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Health Records */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <i className="bx bx-heart text-lg text-slate-400" /> Recent Health Records
            </h2>
            <Link href="/admin/health-records" className="text-xs text-slate-500 hover:text-slate-700">
              View all →
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">BMI</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRecords.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No records yet</td></tr>
              ) : recentRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium capitalize">
                    {rec.resident.lastName}, {rec.resident.firstName}
                  </td>
                  <td className="px-4 py-2 text-slate-500">{rec.bmi}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {rec.healthStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-500">
                    {new Date(rec.dateOfCheckup).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Health Projects */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <i className="bx bx-check-shield text-lg text-slate-400" /> Health Projects
            </h2>
            <Link href="/admin/health-projects" className="text-xs text-slate-500 hover:text-slate-700">
              View all →
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <div className="px-4 py-6 text-center text-slate-400 text-sm">No projects yet</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentProjects.map((proj) => (
                <div key={proj.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-700">{proj.projectName}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(proj.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {" – "}
                      {new Date(proj.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proj.healthStatuses.map((s) => (
                      <Chip
                        key={s.id}
                        label={s.statusName}
                        size="small"
                        sx={{ backgroundColor: statusColor[s.statusName] ?? "#e2e8f0", color: "#fff", fontSize: "0.7rem" }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <MonthlyTrendChart />
    </div>
  )
}
