import { invoke } from "../../blitz-server"
import getPublicProject from "../../queries/getPublicProject"
import Footer from "../../components/Footer"
import Link from "next/link"
import { notFound } from "next/navigation"

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

function calcAge(birthDate: Date) {
  const today = new Date()
  const bd = new Date(birthDate)
  let age = today.getFullYear() - bd.getFullYear()
  if (today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())) age--
  return age
}

export default async function PublicProjectPage({ params }: { params: { id: string } }) {
  const data = await invoke(getPublicProject, { id: Number(params.id) })
  if (!data) notFound()

  const { project, participants } = data
  const isActive = new Date(project.endDate) >= new Date()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <main className="flex-1 px-4 md:px-16 py-8 max-w-5xl mx-auto w-full">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <i className="bx bx-chevron-left text-lg" /> Back to Home
        </Link>

        {/* Project header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-700">{project.projectName}</h1>
              {project.description && (
                <p className="text-slate-500 text-sm mt-1">{project.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                <span><strong className="text-slate-600">Start:</strong> {new Date(project.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span><strong className="text-slate-600">End:</strong> {new Date(project.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                {isActive ? "Active" : "Ended"}
              </span>
              <p className="text-slate-400 text-sm">{participants.length} participant{participants.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.healthStatuses.map((s) => (
              <span
                key={s.id}
                className="text-xs px-2.5 py-1 rounded-full text-white font-medium"
                style={{ backgroundColor: statusColor[s.statusName] ?? "#94a3b8" }}
              >
                {s.statusName}
              </span>
            ))}
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <i className="bx bxs-user-detail text-lg text-slate-400" />
              Participants ({participants.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Residents whose latest health record matches this project's target statuses
            </p>
          </div>

          {participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <i className="bx bxs-user-detail text-5xl" />
              <p className="text-base font-medium">No participants yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-left">Age</th>
                    <th className="px-5 py-3 text-left">Gender</th>
                    <th className="px-5 py-3 text-left">Purok</th>
                    <th className="px-5 py-3 text-left">Health Status</th>
                    <th className="px-5 py-3 text-left">BP Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 capitalize">
                  {participants.map((r) => {
                    const latest = r.HealthRecord[0]
                    return (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-700">
                          {r.lastName}, {r.firstName} {r.middleName}
                        </td>
                        <td className="px-5 py-3 text-slate-500">{calcAge(r.birthDate)}</td>
                        <td className="px-5 py-3 text-slate-500">{r.gender}</td>
                        <td className="px-5 py-3 text-slate-500">{r.address}</td>
                        <td className="px-5 py-3">
                          {latest?.healthStatus ? (
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                              {latest.healthStatus}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-3">
                          {latest?.bloodPressureStatus ? (
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                              {latest.bloodPressureStatus}
                            </span>
                          ) : "—"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <div className="bg-slate-700 py-4">
        <Footer />
      </div>
    </div>
  )
}
