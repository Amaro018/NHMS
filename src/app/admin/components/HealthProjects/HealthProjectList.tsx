import * as React from "react"
import { useMutation } from "@blitzjs/rpc"
import deleteHealthProject from "../../mutations/deleteHealthProject"
import { useQuery } from "@blitzjs/rpc"
import getHealthProjects from "../../queries/getHealthProjects"
import { Box, Typography, List, ListItem, ListItemText, Chip, Button, Modal } from "@mui/material"
import Swal from "sweetalert2"
import HealthProjectForm from "./healthProjectForm"

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}
export default function HealthProjectList() {
  const [healthProjects, { refetch }] = useQuery(getHealthProjects, null)
  const [deleteProjectMutation] = useMutation(deleteHealthProject)
  const [selectedProject, setSelectedProject] = React.useState(null) // State for editing

  React.useEffect(() => {
    refetch()
  }, [refetch])
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      sx={{
        width: "100%",
        borderLeft: "2px solid #ddd",
        borderRight: "2px solid #ddd",
        borderBottom: "2px solid #ddd",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
      }}
    >
      <List>
        {healthProjects.map((project) => (
          <ListItem
            key={project.id}
            sx={{ borderBottom: "1px solid #ddd", paddingBottom: 2 }}
            className="hover:bg-gray-50"
          >
            <ListItemText
              primary={
                <>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box>
                      <Typography
                        variant="h6"
                        display={"flex"}
                        component="span"
                        sx={{ fontWeight: "bold" }}
                      >
                        {project.projectName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {project.description || "No description available."}
                      </Typography>
                    </Box>
                    <Box display={"flex"} gap={2}>
                      <Button variant="contained" color="primary">
                        View Participants
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          setSelectedProject(project)
                          handleOpen()
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
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
                      </Button>
                    </Box>
                  </Box>
                </>
              }
              primaryTypographyProps={{ fontWeight: "bold" }}
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Start Date:</strong>{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(project.startDate))}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>End Date:</strong>{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(project.endDate))}
                  </Typography>
                  <Box sx={{ marginTop: 1 }}>
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
                  </Box>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-2">
            <HealthProjectForm
              project={selectedProject}
              onSubmit={() => {
                handleClose()
                refetch()
              }}
            />
          </div>
        </Box>
      </Modal>
    </Box>
  )
}
