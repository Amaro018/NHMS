import { invoke } from "./blitz-server"
import Footer from "./components/Footer"
import PieChart from "./components/pieChart"
import BpChart from "./components/bpChart"
import getPublicStats from "./queries/getPublicStats"
import Link from "next/link"

export const dynamic = "force-dynamic"

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

function isUpcoming(endDate: Date) {
  return new Date(endDate) >= new Date()
}

export default async function Home() {
  const stats = await invoke(getPublicStats, null).catch(() => ({ residentCount: 0, recordCount: 0, projects: [] }))
  const { residentCount, recordCount, projects } = stats
  const activeProjects = projects.filter((p) => isUpcoming(p.endDate))

  return (
    <div className="flex flex-col min-h-screen">

      {/* Stats bar */}
      <section className="bg-white border-b border-slate-200 py-8 px-6 md:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "bx bxs-user-detail", label: "Registered Residents", value: residentCount },
            { icon: "bx bx-heart", label: "Health Records", value: recordCount },
            { icon: "bx bx-check-shield", label: "Active Health Projects", value: activeProjects.length },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl px-6 py-5 flex items-center gap-5 border border-slate-200">
              <div className="bg-slate-700 rounded-xl p-3">
                <i className={`${stat.icon} text-2xl text-white`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-700">{stat.value}</p>
                <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts row */}
      <section className="bg-white border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col items-center p-4 border-b lg:border-b-0 lg:border-r border-slate-200">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide pt-4">BMI / Weight Status</p>
            <PieChart />
          </div>
          <div className="flex flex-col items-center p-4">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide pt-4">Blood Pressure Status</p>
            <BpChart />
          </div>
        </div>
      </section>

      {/* Info */}
      <main className="flex-1 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-10 md:px-16">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-700 mb-3">
              Nagsiya Health Monitoring System
            </h1>
            <p className="text-slate-600 text-base leading-relaxed text-justify">
              The Nagsiya Health Monitoring System (NHMS) provides an insightful overview of the
              health metrics of residents, focusing on weight-related health categories such as
              normal weight, underweight, overweight, and obesity levels. Community health workers
              can understand the current health landscape at a glance.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Limitations of BMI</h2>
            <p className="text-slate-600 text-base leading-relaxed text-justify">
              BMI cannot account for body composition. Due to varying body types and distribution of
              muscle, bone mass, and fat, BMI should be considered alongside other measurements
              rather than used as the sole method for determining a healthy body weight.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Health Advice</h2>
            <ul className="text-slate-600 text-sm space-y-2 list-disc list-inside">
              <li>Maintaining a healthy weight is important for your heart health.</li>
              <li>Moving more can lower your risk factors for heart disease.</li>
              <li>Eating a healthy diet is the key to heart disease prevention.</li>
              <li>Tracking your heart health stats can help you meet your goals.</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Announcements */}
      {activeProjects.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200 px-6 md:px-16 py-10">
          <div className="flex items-center gap-2 mb-6">
            <i className="bx bx-bullhorn text-2xl text-slate-500" />
            <h2 className="text-2xl font-bold text-slate-700">Upcoming Health Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeProjects.map((project) => (
              <Link
                key={project.id}
                href={`/health-projects/${project.id}`}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-700 text-base group-hover:text-slate-900 transition-colors">{project.projectName}</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap shrink-0">Active</span>
                </div>
                {project.description && (
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{project.description}</p>
                )}
                <div className="text-xs text-slate-400 space-y-1">
                  <p><span className="font-semibold text-slate-500">Start:</span> {new Date(project.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                  <p><span className="font-semibold text-slate-500">End:</span> {new Date(project.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                {project.healthStatuses.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto pt-1">
                    {project.healthStatuses.map((s) => (
                      <span
                        key={s.id}
                        className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: statusColor[s.statusName] ?? "#94a3b8" }}
                      >
                        {s.statusName}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors flex items-center gap-1 mt-1">
                  View participants <i className="bx bx-chevron-right" />
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Contact / Info */}
      <section className="bg-white border-t border-slate-200 px-6 md:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <i className="bx bx-map text-slate-400 text-lg" /> Location
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Barangay Nagsiya, Poblacion<br />
              Santo Domingo, Albay<br />
              Philippines
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <i className="bx bx-time text-slate-400 text-lg" /> Health Center Hours
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Monday – Friday<br />
              8:00 AM – 5:00 PM<br />
              <span className="text-slate-400">Closed on holidays</span>
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <i className="bx bx-phone text-slate-400 text-lg" /> Contact
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Barangay Health Center<br />
              Brgy. Nagsiya, Santo Domingo, Albay<br />
              <span className="text-slate-400">For emergencies, call your local health officer</span>
            </p>
          </div>
        </div>
      </section>

      <div className="bg-slate-700 py-4">
        <Footer />
      </div>
    </div>
  )
}
