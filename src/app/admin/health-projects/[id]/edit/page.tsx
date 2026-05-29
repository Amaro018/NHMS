"use client"
import AdminNav from "../../../components/AdminNav"
import Breadcrumb from "../../../components/Breadcrumb"
import HealthProjectForm from "../../../components/HealthProjects/healthProjectForm"
import { useQuery } from "@blitzjs/rpc"
import getHealthProjects from "../../../queries/getHealthProjects"
import { useParams, useRouter } from "next/navigation"

export default function EditHealthProjectPage() {
  const { id } = useParams<{ id: string }>()
  const [projects] = useQuery(getHealthProjects, null)
  const project = projects.find((p) => p.id === Number(id))
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-16 py-6">
        <Breadcrumb crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Health Projects", href: "/admin/health-projects" },
          { label: project?.projectName ?? "Edit" },
        ]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-6 py-5">
            <h1 className="text-white font-bold text-xl">Edit Health Project</h1>
            <p className="text-slate-300 text-xs mt-0.5">{project?.projectName}</p>
          </div>
          <div className="p-6">
            {project && (
              <HealthProjectForm project={project} onSubmit={() => router.push("/admin/health-projects")} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
