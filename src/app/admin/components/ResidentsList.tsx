import { useMutation, useQuery } from "@blitzjs/rpc"
import getResidents from "../queries/getResidents"
import deleteResident from "../mutations/deleteResident"
import * as React from "react"
import swal from "sweetalert"
import Pagination from "@mui/material/Pagination"
import Stack from "@mui/material/Stack"
import { TextField } from "@mui/material"
import PrintIcon from "@mui/icons-material/Print"
import { useRouter } from "next/navigation"

function exportCSV(residents: any[]) {
  const headers = ["Last Name","First Name","Middle Name","Birth Date","Age","Gender","Purok","Contact","Last Record"]
  const calcAge = (bd: Date) => {
    const t = new Date(), b = new Date(bd)
    let a = t.getFullYear() - b.getFullYear()
    if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--
    return a
  }
  const rows = residents.map(r => {
    const latest = r.HealthRecord?.sort((a,b) => new Date(b.dateOfCheckup).getTime() - new Date(a.dateOfCheckup).getTime())[0]
    return [r.lastName, r.firstName, r.middleName||"", new Date(r.birthDate).toLocaleDateString(), calcAge(r.birthDate), r.gender, r.address, r.contactNumber||"", latest ? new Date(latest.dateOfCheckup).toLocaleDateString() : "No record"]
  })
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a"); a.href = url; a.download = "residents.csv"; a.click()
  URL.revokeObjectURL(url)
}

export default function ResidentList() {
  const router = useRouter()
  const [loadingId, setLoadingId] = React.useState<number | null>(null)
  const [residents, { refetch }] = useQuery(getResidents, null)
  const [deleteResidentMutation] = useMutation(deleteResident)

  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortConfig, setSortConfig] = React.useState({ key: "lastName", direction: "asc" })
  const [selectedGender, setSelectedGender] = React.useState("")
  const [selectedPurok, setSelectedPurok] = React.useState("")
  const [ageMin, setAgeMin] = React.useState("")
  const [ageMax, setAgeMax] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  const tableRef = React.useRef<HTMLDivElement>(null)

  const calcAge = (birthDate: Date) => {
    const today = new Date()
    const bd = new Date(birthDate)
    let age = today.getFullYear() - bd.getFullYear()
    if (today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())) age--
    return age
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    const printContent = tableRef.current.innerHTML
    printWindow.document.open()
    printWindow.document.write(`
      <html>
        <head>
          <title>HEALTH RECORDS OF BRGY NAGSIYA</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body onload="window.print(); window.close();">${printContent}</body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleDeleteResident = async (id) => {
    try {
      await deleteResident({ id })
      await refetch()
      swal("Deleted!", "Resident and associated health records have been deleted.", "success")
    } catch {
      swal("Error", "Failed to delete resident. Please try again.", "error")
    }
  }

  const confirmDelete = (id) => {
    swal({ title: "Are you sure?", text: "This will delete the resident and all their health records.", icon: "warning", buttons: true, dangerMode: true })
      .then((willDelete) => { if (willDelete) handleDeleteResident(id) })
  }

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    )
  }

  const filteredResidents = React.useMemo(() => {
    return residents
      .filter((r) => {
        const fullName = `${r.firstName} ${r.middleName} ${r.lastName}`
        return (
          fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedGender ? r.gender === selectedGender : true) &&
          (selectedPurok ? r.address === selectedPurok : true) &&
          (ageMin ? calcAge(r.birthDate) >= Number(ageMin) : true) &&
          (ageMax ? calcAge(r.birthDate) <= Number(ageMax) : true)
        )
      })
      .sort((a, b) => {
        const aVal = String(a[sortConfig.key] ?? "")
        const bVal = String(b[sortConfig.key] ?? "")
        const cmp = aVal.localeCompare(bVal)
        return sortConfig.direction === "asc" ? cmp : -cmp
      })
  }, [residents, searchTerm, selectedGender, selectedPurok, ageMin, ageMax, sortConfig])

  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage)
  const paginatedResidents = filteredResidents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const selectClass = "px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Toolbar row 1: filters */}
      <div className="flex flex-wrap gap-2 items-center px-4 pt-3 pb-2 border-b border-slate-100">
        <input
          type="text"
          placeholder="Search name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${selectClass} w-40`}
        />
        <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)} className={selectClass}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select value={selectedPurok} onChange={(e) => setSelectedPurok(e.target.value)} className={selectClass}>
          <option value="">All Puroks</option>
          <option value="Purok 1">Purok 1</option>
          <option value="Purok 2">Purok 2</option>
          <option value="Purok 3">Purok 3</option>
          <option value="Purok 4">Purok 4</option>
        </select>
        <div className="flex items-center gap-1">
          <input type="number" placeholder="Age min" value={ageMin} onChange={e => { setAgeMin(e.target.value); setCurrentPage(1) }}
            className={`${selectClass} w-20`} min={0} max={120} />
          <span className="text-slate-400 text-xs">–</span>
          <input type="number" placeholder="Age max" value={ageMax} onChange={e => { setAgeMax(e.target.value); setCurrentPage(1) }}
            className={`${selectClass} w-20`} min={0} max={120} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-slate-500">Show</span>
          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }} className={selectClass}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        {/* Actions pushed right */}
        <div className="flex gap-2 items-center ml-auto">
          <button className="bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
            onClick={() => router.push("/admin/resident/new")}>
            + Add
          </button>
          <button className="bg-green-700 hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
            onClick={() => exportCSV(filteredResidents)}>
            <i className="bx bx-export" /> CSV
          </button>
          <button className="border border-slate-300 hover:bg-slate-50 text-slate-600 text-sm font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
            onClick={handlePrint}>
            <PrintIcon fontSize="small" /> Print
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" ref={tableRef}>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("lastName")}>Name <i className="bx bxs-sort-alt" /></th>
              <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("birthDate")}>Birth Date</th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("gender")}>Gender</th>
              <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("address")}>Purok</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Last Record</th>
              <th className="px-4 py-3 text-left no-print">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 capitalize">
            {paginatedResidents.length === 0 && (
              <tr>
                <td colSpan={8} className="py-16 text-slate-400 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <i className="bx bxs-user-detail text-5xl" />
                    <p className="text-base font-medium">No residents found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            )}
            {paginatedResidents.map((resident) => (
              <tr key={resident.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{resident.lastName}, {resident.firstName} {resident.middleName}</td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(resident.birthDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="px-4 py-3 text-slate-500">{calcAge(resident.birthDate)}</td>
                <td className="px-4 py-3 text-slate-500">{resident.gender}</td>
                <td className="px-4 py-3 text-slate-500">{resident.address}</td>
                <td className="px-4 py-3 text-slate-500">{resident.contactNumber || "—"}</td>
                <td className="px-4 py-3 text-slate-500">
                  {resident.HealthRecord.length > 0
                    ? new Date(resident.HealthRecord.sort((a, b) => new Date(b.dateOfCheckup).getTime() - new Date(a.dateOfCheckup).getTime())[0].dateOfCheckup)
                        .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : <span className="text-slate-300">No record</span>}
                </td>
                <td className="px-4 py-3 no-print">
                  <div className="flex gap-2">
                    <button
                      className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                      onClick={() => { setLoadingId(resident.id); router.push(`/admin/resident/${resident.id}/edit`) }}
                      disabled={loadingId === resident.id}
                    >
                      {loadingId === resident.id ? <><i className="bx bx-loader-alt animate-spin" /> Loading</> : "Edit"}
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                      onClick={() => confirmDelete(resident.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center p-3 border-t border-slate-100">
        <Stack spacing={2}>
          <Pagination count={totalPages} page={currentPage} onChange={(_, v) => setCurrentPage(v)} variant="outlined" shape="rounded" color="primary" />
        </Stack>
      </div>
    </div>
  )
}
