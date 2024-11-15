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
import { TextField } from "@mui/material"
import PrintIcon from "@mui/icons-material/Print"

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

  // Add new state for filtering by gender and Purok
  const [selectedGender, setSelectedGender] = React.useState("")
  const [selectedPurok, setSelectedPurok] = React.useState("")

  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  const tableRef = React.useRef()

  const [openResident, setOpenResident] = React.useState(false)

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    const printContent = tableRef.current.innerHTML
    printWindow.document.open()
    printWindow.document.write(`
      <html>
        <head>
          <title>HEALTH RECORDS OF BRGY NAGSIYA</title>
          <style>
            /* General styling for print view */
            body { font-family: Arial, sans-serif; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 4px solid #ddd; padding: 14px; }
            th { background-color: #f2f2f2; }
  
            /* Hide elements with the 'no-print' class */
            .no-print { display: none !important; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
          
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleOpen = (resident) => {
    setSelectedResident(resident)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedResident(null)
  }

  const handleOpenResident = () => setOpenResident(true)
  const handleCloseResident = () => {
    setSelectedResident(null)
    setOpenResident(false)
    refetch()
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

  // Filter by search term, gender, and Purok
  const filteredResidents = React.useMemo(() => {
    return residents
      .filter((resident) => {
        const fullName = `${resident.firstName} ${resident.middleName} ${resident.lastName}`
        return (
          fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedGender ? resident.gender === selectedGender : true) &&
          (selectedPurok ? resident.address === selectedPurok : true)
        )
      })
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
  }, [residents, searchTerm, selectedGender, selectedPurok, sortConfig])

  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage)

  const paginatedResidents = filteredResidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(1) // Reset to first page on items per page change
  }

  return (
    <div className="overflow-x-auto ">
      <div className="flex flex-row justify-between border border-x-black p-2 items-center">
        <div className="flex flex-row gap-4">
          <TextField
            label="SEARCH RESIDENT"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
          />
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={selectedPurok}
            onChange={(e) => setSelectedPurok(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Puroks</option>
            <option value="Purok 1">Purok 1</option>
            <option value="Purok 2">Purok 2</option>
            <option value="Purok 3">Purok 3</option>
            <option value="Purok 4">Purok 4</option>
          </select>
          <div className="flex items-center gap-4">
            <label htmlFor="itemsPerPage">Show : </label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-2 border rounded"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div>
            <button
              className="bg-slate-600 p-4 rounded-md outline-2 shadow-lg hover:bg-slate-500 text-white dark:bg-white dark:text-black"
              onClick={handleOpen}
            >
              Add Resident
            </button>
          </div>
          <button
            className="bg-slate-600 px-8 rounded-md outline-2 shadow-lg hover:bg-slate-500 text-white"
            onClick={handlePrint}
          >
            Print <PrintIcon />
          </button>
        </div>
      </div>
      <div ref={tableRef}>
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
              <th className="px-4 py-2 border-b border-slate-600">Last Record</th>
              <th className="px-4 py-2 border-b border-slate-600 no-print">Action</th>
            </tr>
          </thead>
          <tbody className="text-center capitalize">
            {paginatedResidents.map((resident) => (
              <tr key={resident.id}>
                <td className="px-4 py-2 border-b border-slate-600">
                  {resident.firstName + " " + resident.middleName + " " + resident.lastName}
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
                <td className="px-4 py-2 border-b border-slate-600 no-print">
                  <button
                    className="bg-slate-600 p-2 rounded-md text-white hover:bg-slate-500"
                    onClick={() => handleOpen(resident)}
                  >
                    Update
                  </button>
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
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <ResidentForm resident={selectedResident} />
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

      <div>{filteredResidents.length === 0 && <p>No residents found.</p>}</div>
    </div>
  )
}
