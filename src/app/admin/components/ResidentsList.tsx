import { useMutation, useQuery } from "@blitzjs/rpc"
import getResidents from "../queries/getResidents"
import deleteResident from "../mutations/deleteResident"
import * as React from "react"
import updateResident from "../mutations/updateResident"
import createHealthRecord from "../mutations/createHealthRecord"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import ResidentForm from "./ResidentsForm"
import HealthRecordForm from "./HealthRecordForm"
import swal from "sweetalert"
import { Resident } from "@prisma/client"
import Pagination from "@mui/material/Pagination"
import Stack from "@mui/material/Stack"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
}

export default function ResidentList() {
  const [residents, { refetch }] = useQuery(getResidents, null)
  const [deleteResidentMutation] = useMutation(deleteResident)
  const [createRecord] = useMutation(createHealthRecord)

  const [open, setOpen] = React.useState(false)
  const [openRecord, setOpenRecord] = React.useState(false)
  const [selectedResident, setSelectedResident] = React.useState(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortConfig, setSortConfig] = React.useState({ key: "name", direction: "asc" })

  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  // Filter data based on search term
  const filteredData = residents.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpen = (resident) => {
    setSelectedResident(resident)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedResident(null)
  }

  const handleDeleteResident = async (id) => {
    try {
      await deleteResident({ id })
      await refetch()
      swal("Deleted!", "Resident and associated health records have been deleted.", "success")
    } catch (error) {
      swal("Error", "Failed to delete resident. Please try again.", "error")
    }
  }

  const handleOpenRecord = (resident: Resident) => {
    setSelectedResident(resident)
    setOpenRecord(true)
  }

  const handleCloseRecord = () => {
    setOpenRecord(false)
    setSelectedResident(null)
  }

  const confirmDelete = (id) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete this resident and all associated health records?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) handleDeleteResident(id)
    })
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedResidents = React.useMemo(() => {
    return residents
      .filter((resident) =>
        (resident.firstName + " " + resident.lastName)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
  }, [residents, sortConfig, searchTerm])

  // Calculate total pages
  const totalPages = Math.ceil(sortedResidents.length / itemsPerPage)

  // Get the residents for the current page
  const paginatedResidents = sortedResidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  return (
    <div className="overflow-x-auto">
      <div className="py-4">
        <input
          type="text"
          placeholder="Search by Last or First name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" p-2 border rounded"
        />
      </div>

      <table className="min-w-full rounded-md border border-slate-600">
        <thead>
          <tr>
            <th
              className="px-4 py-2 border-b cursor-pointer border-slate-600"
              onClick={() => handleSort("lastName")}
            >
              Name<i className="bx bxs-sort-alt"></i>
            </th>
            <th
              className="px-4 py-2 border-b cursor-pointer border-slate-600"
              onClick={() => handleSort("birthDate")}
            >
              Birth Date
            </th>
            <th
              className="px-4 py-2 border-b cursor-pointer border-slate-600"
              onClick={() => handleSort("gender")}
            >
              Gender
            </th>
            <th
              className="px-4 py-2 border-b cursor-pointer border-slate-600"
              onClick={() => handleSort("address")}
            >
              Purok
            </th>
            <th className="px-4 py-2 border-b border-slate-600">Contact Number</th>
            <th className="px-4 py-2 border-b border-slate-600">Health Status</th>
            <th className="px-4 py-2 border-b border-slate-600">Action</th>
          </tr>
        </thead>
        <tbody className="text-center capitalize">
          {paginatedResidents.map((resident) => (
            <tr key={resident.id}>
              <td className="px-4 py-2 border-b border-slate-600">
                {resident.lastName + ", " + resident.middleName + " " + resident.firstName}
              </td>
              <td className="px-4 py-2 border-b border-slate-600">
                {new Date(resident.birthDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td className="px-4 py-2 border-b border-slate-600">{resident.gender}</td>
              <td className="px-4 py-2 border-b border-slate-600">{resident.address}</td>
              <td className="px-4 py-2 border-b border-slate-600">
                {resident.contactNumber || "-"}
              </td>
              <td className="px-4 py-2 border-b border-slate-600">
                {resident.HealthRecord.length > 0 ? (
                  (() => {
                    const latestRecord = resident.HealthRecord.sort(
                      (a, b) => new Date(b.dateOfCheckup) - new Date(a.dateOfCheckup)
                    )[0]
                    return (
                      <span>
                        {new Date(latestRecord.dateOfCheckup).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )
                  })()
                ) : (
                  <span>No Record</span>
                )}
              </td>
              <td className="px-4 py-2 border-b border-slate-600">
                <button
                  className="bg-slate-600 p-2 rounded-md text-white hover:bg-slate-500"
                  onClick={() => handleOpen(resident)}
                >
                  Update
                </button>
                {/* <button
                  className="bg-green-600 p-2 rounded-md text-white ml-2 hover:bg-green-500"
                  onClick={() => handleOpenRecord(resident)}
                >
                  Add Record
                </button> */}
                <button
                  className="bg-red-600 p-2 rounded-md text-white ml-2 hover:bg-red-500"
                  onClick={() => confirmDelete(resident.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <ResidentForm resident={selectedResident} />
        </Box>
      </Modal>

      {/* <Modal open={openRecord} onClose={handleCloseRecord}>
        <Box sx={style}>
          <HealthRecordForm resident={selectedResident} />
        </Box>
      </Modal> */}

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

      <div>{filteredData.length === 0 && <p>No residents found.</p>}</div>
    </div>
  )
}
