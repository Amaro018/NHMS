import { useQuery } from "@blitzjs/rpc"
import getResidents from "../queries/getResidents"
import getRecords from "../queries/getRecords"
import * as React from "react"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import HealthRecordForm from "./HealthRecordForm"
import ResidentHealthRecords from "./HealthRecords/ResidentHealthRecords"
import { Pagination, Stack } from "@mui/material"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
}

const styleViewing = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
}

export default function HealthRecordList() {
  const [residents, { refetch }] = useQuery(getResidents, null)
  const [records] = useQuery(getRecords, null)
  const [open, setOpen] = React.useState(false)
  const { isLoading } = useQuery(getResidents, null)
  const [openViewRecords, setOpenViewRecords] = React.useState(false)
  const [selectedResident, setSelectedResident] = React.useState(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortConfig, setSortConfig] = React.useState({ key: "name", direction: "asc" })
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10
  const [selectedHealthStatus, setSelectedHealthStatus] = React.useState("")
  const [selectedbloodPressureStatus, setSelectedbloodPressureStatus] = React.useState("")

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedResidents = React.useMemo(() => {
    return residents
      .filter((resident) => {
        const fullName =
          `${resident.firstName} ${resident.middleName} ${resident.lastName}`.toLowerCase()
        const residentRecords = records
          .filter((record) => record.residentId === resident.id)
          .sort((a, b) => new Date(b.dateOfCheckup) - new Date(a.dateOfCheckup))

        const latestRecord = residentRecords[0]

        return (
          fullName.includes(searchTerm.toLowerCase()) &&
          (selectedHealthStatus ? latestRecord?.healthStatus === selectedHealthStatus : true) &&
          (selectedbloodPressureStatus
            ? latestRecord?.bloodPressureStatus === selectedbloodPressureStatus
            : true)
        )
      })
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
  }, [
    residents,
    sortConfig,
    searchTerm,
    selectedHealthStatus,
    selectedbloodPressureStatus,
    records,
  ])

  const totalPages = Math.ceil(sortedResidents.length / itemsPerPage)
  const paginatedResidents = sortedResidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = async (event, value) => {
    setCurrentPage(value)
    await refetch()
  }

  const handleOpen = (resident) => {
    setSelectedResident(resident)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedResident(null)
  }

  const handleOpenViewRecords = (resident) => {
    setSelectedResident(resident)
    setOpenViewRecords(true)
  }

  const handleCloseViewRecords = async () => {
    setOpenViewRecords(false)
    setSelectedResident(null)
    await refetch()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="overflow-x-auto py-4 modal-pages">
      <div className="py-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by Last or First name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={selectedbloodPressureStatus}
          onChange={(e) => setSelectedbloodPressureStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="Hypotension">Hypotension</option>
          <option value="Normal">Normal</option>
          <option value="Elevated">Elevated</option>
          <option value="Hypertension Stage 1">Hypertension Stage 1</option>
          <option value="Hypertension Stage 2">Hypertension Stage 2</option>
          <option value="Hypertensive Crisis">Hypertensive Crisis</option>
        </select>
        <select
          value={selectedHealthStatus}
          onChange={(e) => setSelectedHealthStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="Normal weight">Normal weight</option>
          <option value="Underweight">Underweight</option>
          <option value="Overweight">Overweight</option>
          <option value="Class I Obese">Class I Obese</option>
          <option value="Class II Obese">Class II obese</option>
          <option value="Class III Obese">Class III obese</option>
        </select>
      </div>

      <table className="min-w-full rounded-md border border-slate-600">
        <thead>
          <tr>
            <th className="py-2 border-b cursor-pointer border-slate-600">
              Name<i className="bx bxs-sort-alt" onClick={() => handleSort("name")}></i>
            </th>
            <th className="py-2 border-b cursor-pointer border-slate-600">Age</th>
            <th className="py-2 border-b cursor-pointer border-slate-600">Height</th>
            <th className="py-2 border-b cursor-pointer border-slate-600">Weight</th>
            <th className="py-2 border-b border-slate-600">BMI</th>
            <th className="py-2 border-b border-slate-600">Health Status</th>
            <th className="py-2 border-b border-slate-600">BP Status</th>
            <th className="py-2 border-b border-slate-600">Last Checkup</th>
            <th className="py-2 border-b border-slate-600">Action</th>
          </tr>
        </thead>
        <tbody className="text-center capitalize">
          {paginatedResidents.map((resident) => {
            const residentRecords = records
              .filter((record) => record.residentId === resident.id)
              .sort((a, b) => new Date(b.dateOfCheckup) - new Date(a.dateOfCheckup))

            const latestRecord = residentRecords[0]

            return (
              <tr key={resident.id}>
                <td className="px-4 py-2 border-b border-slate-600">
                  {resident.firstName} {resident.middleName} {resident.lastName}
                </td>
                <td className="px-4 py-2 border-b border-slate-600">
                  {(() => {
                    const today = new Date()
                    const birthDate = new Date(resident.birthDate)
                    let age = today.getFullYear() - birthDate.getFullYear()
                    const monthDifference = today.getMonth() - birthDate.getMonth()

                    if (
                      monthDifference < 0 ||
                      (monthDifference === 0 && today.getDate() < birthDate.getDate())
                    ) {
                      age--
                    }
                    return age
                  })()}
                </td>
                <td className="px-4 py-2 border-b border-slate-600">
                  {latestRecord ? `${latestRecord.height} cm` : "N/A"}
                </td>
                <td className="px-4 py-2 border-b border-slate-600">
                  {latestRecord ? `${latestRecord.weight} kg` : "N/A"}
                </td>
                <td className="px-4 py-2 border-b border-slate-600">
                  {latestRecord ? latestRecord.bmi : "N/A"}
                </td>
                <td
                  className={`px-4 py-2 border-b border-slate-600 ${getHealthStatusClass(
                    latestRecord?.healthStatus
                  )}`}
                >
                  {latestRecord ? latestRecord.healthStatus : "N/A"}
                </td>
                <td
                  className={`px-4 py-2 border-b border-slate-600 ${getBPStatusClass(
                    latestRecord?.bloodPressureStatus
                  )}`}
                >
                  {latestRecord ? latestRecord.bloodPressureStatus : "N/A"}
                </td>
                <td className="px-4 py-2 border-b border-slate-600">
                  {latestRecord
                    ? new Date(latestRecord.dateOfCheckup).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="px-4 py-2 border-b border-slate-600">
                  <button
                    className="bg-blue-600 p-2 rounded-md text-white hover:bg-blue-500"
                    onClick={() => handleOpenViewRecords(resident)}
                  >
                    View Records
                  </button>
                  <button
                    className="bg-green-600 p-2 rounded-md text-white ml-2 hover:bg-green-500"
                    onClick={() => handleOpen(resident)}
                  >
                    Add Record
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <HealthRecordForm resident={selectedResident} onSuccess={handleClose} />
        </Box>
      </Modal>

      <Modal open={openViewRecords} onClose={handleCloseViewRecords}>
        <Box sx={styleViewing}>
          <ResidentHealthRecords resident={selectedResident} />
        </Box>
      </Modal>

      <div className="flex justify-center p-2">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Stack>
      </div>
    </div>
  )
}

function getHealthStatusClass(status) {
  switch (status) {
    case "Normal weight":
      return "text-green-500"
    case "Underweight":
    case "Overweight":
      return "text-yellow-500"
    case "Class I Obese":
      return "text-orange-500"
    case "Class II Obese":
      return "text-red-500"
    case "Class III Obese":
      return "text-red-600"
    default:
      return ""
  }
}

function getBPStatusClass(status) {
  switch (status) {
    case "Normal":
      return "text-green-500"
    case "Hypotension":
      return "text-yellow-200"
    case "Elevated":
    case "Hypertension Stage 1":
      return "text-yellow-500"
    case "Hypertension Stage 2":
      return "text-orange-500"
    case "Hypertensive Crisis":
      return "text-red-500"
    default:
      return ""
  }
}
