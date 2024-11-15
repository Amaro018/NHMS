import * as React from "react"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { TextField, Checkbox, FormControlLabel, Button, Box, Typography } from "@mui/material"
import { useMutation } from "@blitzjs/rpc"
import dayjs from "dayjs"
import createHealthProject from "../../mutations/createHealthProject"
import updateHealthProject from "../../mutations/updateHealthProject"
import swal from "sweetalert"
import { useRouter } from "next/navigation"

export default function HealthProjectForm({ project, onSubmit }) {
  const router = useRouter()

  // Set initial state based on whether we are editing or creating a project
  const [projectName, setProjectName] = React.useState(project?.projectName || "")
  const [description, setDescription] = React.useState(project?.description || "")
  const [startDate, setStartDate] = React.useState(dayjs(project?.startDate) || dayjs())
  const [endDate, setEndDate] = React.useState(dayjs(project?.endDate) || dayjs())
  const [targetHealthStatuses, setTargetHealthStatuses] = React.useState(
    project?.targetHealthStatuses || []
  )

  const [createProjectMutation] = useMutation(createHealthProject)
  const [updateProjectMutation] = useMutation(updateHealthProject)

  const healthStatuses = [
    "Normal",
    "Hypotension",
    "Underweight",
    "Elevated",
    "Overweight",
    "Hypertension Stage 1",
    "Class I Obese",
    "Hypertension Stage 2",
    "Class II Obese",
    "Hypertensive Crisis",
    "Class III Obese",
    "All Residents",
  ]

  const handleCheckboxChange = (status) => {
    if (status === "All Residents") {
      // If "All Residents" is checked, select only "All Residents" and uncheck others
      setTargetHealthStatuses(
        (prevStatuses) =>
          prevStatuses.includes("All Residents")
            ? [] // Uncheck "All Residents" if it's already selected
            : ["All Residents"] // Otherwise, select only "All Residents"
      )
    } else {
      // If another status is selected, toggle it only if "All Residents" is not checked
      setTargetHealthStatuses((prevStatuses) => {
        if (prevStatuses.includes("All Residents")) {
          return prevStatuses // Do nothing if "All Residents" is checked
        }
        // Toggle the selected status
        return prevStatuses.includes(status)
          ? prevStatuses.filter((item) => item !== status)
          : [...prevStatuses, status]
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (endDate.isBefore(startDate)) {
      swal("Error", "End date cannot be before start date.", "error")
      return
    }

    try {
      if (project) {
        // If `project` exists, we are editing an existing project
        await updateProjectMutation({
          id: project.id,
          projectName,
          description,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          targetHealthStatuses,
        })
        swal("Success", "Health project updated successfully!", "success")
      } else {
        // If no `project`, create a new one
        await createProjectMutation({
          projectName,
          description,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          targetHealthStatuses,
        })
        swal("Success", "Health project created successfully!", "success")
      }
      onSubmit && onSubmit()
    } catch (error) {
      swal("Error", "Failed to save health project. Please try again.", "error")
    }
  }

  return (
    <main>
      <form className="flex flex-col space-y-4 p-4" onSubmit={handleSubmit}>
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: "slategray" }}>
          {project ? "Editing Barangay Health Project" : "Adding New Barangay Health Project"}
        </Typography>
        <TextField
          label="Project Name"
          variant="outlined"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <TextField
          label="Description"
          multiline
          maxRows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" width={"100%"} gap={2}>
            <Box sx={{ width: "100%" }}>
              <Typography>Project Start Date:</Typography>
              <DatePicker
                minDate={dayjs()}
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                sx={{ width: "100%" }}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography>Project End Date:</Typography>
              <DatePicker
                minDate={dayjs()}
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                sx={{ width: "100%" }}
              />
            </Box>
          </Box>
        </LocalizationProvider>
        <Box>
          <Typography variant="h6" gutterBottom>
            Target Health Statuses:
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
            {healthStatuses.map((status) => (
              <FormControlLabel
                key={status}
                control={
                  <Checkbox
                    checked={targetHealthStatuses.includes(status)}
                    onChange={() => handleCheckboxChange(status)}
                    color="primary"
                  />
                }
                label={status}
              />
            ))}
          </Box>
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {project ? "Update" : "Save"}
        </Button>
      </form>
    </main>
  )
}
