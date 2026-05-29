import * as React from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import deleteHealthProject from "../../mutations/deleteHealthProject"
import getHealthProjects from "../../queries/getHealthProjects"
import { List, ListItem, ListItemText, Chip } from "@mui/material"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"


export default function HealthProjectList() {
  const router = useRouter()
  const [healthProjects, { refetch }] = useQuery(getHealthProjects, null)
  const [deleteProjectMutation] = useMutation(deleteHealthProject)
  const [loadingId, setLoadingId] = React.useState<number | null>(null)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {healthProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
          <i className="bx bx-check-shield text-5xl" />
          <p className="text-base font-medium">No health projects yet</p>
          <p className="text-sm">Add a project to get started.</p>
        </div>
      )}
      <List disablePadding>
        {healthProjects.map((project) => (
          <ListItem
            key={project.id}
            sx={{ borderBottom: "1px solid #f1f5f9", py: 2 }}
            className="hover:bg-slate-50 transition-colors"
          >
            <ListItemText
              primary={
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-base">{project.projectName}</p>
                      <p className="text-sm text-slate-500">{project.description || "No description available."}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                        onClick={() => router.push(`/admin/health-projects/${project.id}`)}
                      >
                        View Participants
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                        onClick={() => { setLoadingId(project.id); router.push(`/admin/health-projects/${project.id}/edit`) }}
                        disabled={loadingId === project.id}
                      >
                        {loadingId === project.id ? <><i className="bx bx-loader-alt animate-spin" />Loading</> : "Edit"}
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                        onClick={async () => {
                          const result = await Swal.fire({
                            icon: "warning",
                            title: "Are you sure?",
                            text: "Do you really want to delete this project?",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes",
                            cancelButtonText: "No",
                          })
                          if (result.isConfirmed) {
                            try {
                              await deleteProjectMutation({ id: project.id })
                              refetch()
                              Swal.fire({
                                icon: "success",
                                title: "Deleted",
                                text: "Project has been deleted successfully.",
                                confirmButtonColor: "#3085d6",
                                confirmButtonText: "OK",
                              })
                            } catch (error) {
                              Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Something went wrong while deleting the project.",
                                confirmButtonColor: "#d33",
                                confirmButtonText: "Try Again",
                              })
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              }
              primaryTypographyProps={{ fontWeight: "bold" }}
              secondary={
                <>
                  <p className="text-sm text-slate-500">
                    <strong>Start:</strong>{" "}
                    {new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" }).format(new Date(project.startDate))}
                  </p>
                  <p className="text-sm text-slate-500">
                    <strong>End:</strong>{" "}
                    {new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" }).format(new Date(project.endDate))}
                  </p>
                  <div className="mt-2">
                    <strong>Target Health Statuses: </strong>

                    {project.healthStatuses.map((status) => (
                      <Chip
                        key={status.id}
                        label={status.statusName}
                        sx={{
                          marginRight: 1,
                          color: "#fff",
                          backgroundColor:
                            status.statusName === "Normal"
                              ? "#00e676"
                              : status.statusName === "Hypotension"
                              ? "#ff9800"
                              : status.statusName === "Elevated"
                              ? "#ff9800"
                              : status.statusName === "Hypertension Stage 1"
                              ? "#fca5a5"
                              : status.statusName === "Hypertension Stage 2"
                              ? "#ff5252"
                              : status.statusName === "Hypertensive Crisis"
                              ? "#7f1d1d"
                              : status.statusName === "Class III Obese"
                              ? "#7f1d1d"
                              : status.statusName === "Class II Obese"
                              ? "#ef4444"
                              : status.statusName === "Class I Obese"
                              ? "#fca5a5"
                              : status.statusName === "Underweight"
                              ? "#ff9800"
                              : status.statusName === "Overweight"
                              ? "#fca5a5"
                              : status.statusName === "All Residents"
                              ? "#22d3ee"
                              : undefined,
                        }}
                      />
                    ))}
                  </div>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  )
}
