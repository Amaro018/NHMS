import React, { useRef } from "react"
import { useQuery } from "@blitzjs/rpc"
import getResidents from "../queries/getResidents"
import getRecords from "../queries/getRecords"
import { Pagination, Stack } from "@mui/material"
import PrintIcon from "@mui/icons-material/Print"
import { useRouter } from "next/navigation"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(95vw, 500px)",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
  borderRadius: "16px",
  outline: "none",
}

const styleViewing = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(95vw, 1100px)",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
  borderRadius: "16px",
  outline: "none",
}

function exportHealthCSV(residents: any[], records: any[]) {
  const headers = ["Name","Age","Height(cm)","Weight(kg)","BMI","Health Status","BP Status","Systolic","Diastolic","Last Checkup"]
  const calcAge = (bd: Date) => {
    const t = new Date(), b = new Date(bd)
    let a = t.getFullYear() - b.getFullYear()
    if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--
    return a
  }
  const rows = residents.map(r => {
    const latest = records.filter(rec => rec.residentId === r.id).sort((a,b) => new Date(b.dateOfCheckup).getTime() - new Date(a.dateOfCheckup).getTime())[0]
    return [
      `${r.lastName}, ${r.firstName}`, calcAge(r.birthDate),
      latest?.height??"", latest?.weight??"", latest?.bmi??"",
      latest?.healthStatus??"", latest?.bloodPressureStatus??"",
      latest?.systolic??"", latest?.diastolic??"",
      latest ? new Date(latest.dateOfCheckup).toLocaleDateString() : ""
    ]
  })
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a"); a.href = url; a.download = "health-records.csv"; a.click()
  URL.revokeObjectURL(url)
}

export default function HealthRecordList() {
  const router = useRouter()
  const [residents] = useQuery(getResidents, null)
  const [records] = useQuery(getRecords, null)
  const [loadingView, setLoadingView] = React.useState<number | null>(null)
  const [loadingAdd, setLoadingAdd] = React.useState<number | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortConfig, setSortConfig] = React.useState({ key: "name", direction: "asc" })
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  const [selectedHealthStatus, setSelectedHealthStatus] = React.useState("")
  const [selectedbloodPressureStatus, setSelectedbloodPressureStatus] = React.useState("")
  const [dateFrom, setDateFrom] = React.useState("")
  const [dateTo, setDateTo] = React.useState("")

  const tableRef = useRef()

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

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedResidents = React.useMemo(() => {
    if (!residents || !records) return []

    return residents
      .filter((resident) => {
        const fullName = `${resident.firstName} ${resident.middleName || ""} ${
          resident.lastName
        }`.toLowerCase()

        const residentRecords = records
          ?.filter((record) => record.residentId === resident.id)
          ?.sort((a, b) => new Date(b.dateOfCheckup) - new Date(a.dateOfCheckup))

        const latestRecord = residentRecords?.[0]

        return (
          fullName.includes(searchTerm.toLowerCase()) &&
          (selectedHealthStatus ? latestRecord?.healthStatus === selectedHealthStatus : true) &&
          (selectedbloodPressureStatus ? latestRecord?.bloodPressureStatus === selectedbloodPressureStatus : true) &&
          (dateFrom && latestRecord ? new Date(latestRecord.dateOfCheckup) >= new Date(dateFrom) : true) &&
          (dateTo && latestRecord ? new Date(latestRecord.dateOfCheckup) <= new Date(dateTo) : true)
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
    dateFrom,
    dateTo,
    records,
  ])

  const totalPages = Math.ceil(sortedResidents.length / itemsPerPage)
  const paginatedResidents = sortedResidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const handleItemsPerPageChange = (event: any) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(1) // Reset to first page on items per page change
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex flex-wrap gap-2 items-center px-4 pt-3 pb-2 border-b border-slate-100">
        <input type="text" placeholder="Search name..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 w-36" />
        <select value={selectedbloodPressureStatus} onChange={(e) => setSelectedbloodPressureStatus(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300">
          <option value="">All BP</option>
          <option value="Hypotension">Hypotension</option>
          <option value="Normal">Normal</option>
          <option value="Elevated">Elevated</option>
          <option value="Hypertension Stage 1">HT Stage 1</option>
          <option value="Hypertension Stage 2">HT Stage 2</option>
          <option value="Hypertensive Crisis">HT Crisis</option>
        </select>
        <select value={selectedHealthStatus} onChange={(e) => setSelectedHealthStatus(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300">
          <option value="">All BMI</option>
          <option value="Normal weight">Normal</option>
          <option value="Underweight">Underweight</option>
          <option value="Overweight">Overweight</option>
          <option value="Class I Obese">Class I</option>
          <option value="Class II Obese">Class II</option>
          <option value="Class III Obese">Class III</option>
        </select>
        <div className="flex items-center gap-1">
          <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setCurrentPage(1) }}
            className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
            title="From date" />
          <span className="text-slate-400 text-xs">–</span>
          <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setCurrentPage(1) }}
            className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
            title="To date" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-slate-500">Show</span>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}
            className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex gap-2 items-center ml-auto">
          <button className="bg-green-700 hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
            onClick={() => exportHealthCSV(sortedResidents, records)}>
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
              <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("name")}>
                Name <i className="bx bxs-sort-alt" />
              </th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left">Height</th>
              <th className="px-4 py-3 text-left">Weight</th>
              <th className="px-4 py-3 text-left">BMI</th>
              <th className="px-4 py-3 text-left">Health Status</th>
              <th className="px-4 py-3 text-left">BP Status</th>
              <th className="px-4 py-3 text-left">Last Checkup</th>
              <th className="px-4 py-3 text-left no-print">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 capitalize">
            {paginatedResidents.length === 0 && (
              <tr>
                <td colSpan={9} className="py-16 text-slate-400 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <i className="bx bx-heart text-5xl" />
                    <p className="text-base font-medium">No health records found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            )}
            {paginatedResidents.map((resident) => {
              const residentRecords = records
                .filter((record) => record.residentId === resident.id)
                .sort((a, b) => new Date(b.dateOfCheckup) - new Date(a.dateOfCheckup))

              const latestRecord = residentRecords[0]

              return (
                <tr key={resident.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    {resident.firstName} {resident.middleName} {resident.lastName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
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
                  <td className="px-4 py-3 text-slate-600">
                    {latestRecord ? `${latestRecord.height} cm` : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {latestRecord ? `${latestRecord.weight} kg` : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
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
                  <td className="px-4 py-3 text-slate-600">
                    {latestRecord
                      ? new Date(latestRecord.dateOfCheckup).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 no-print">
                    <div className="flex gap-2">
                      <button
                        className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                        onClick={() => { setLoadingView(resident.id); router.push(`/admin/health-records/${resident.id}`) }}
                        disabled={loadingView === resident.id}
                      >
                        {loadingView === resident.id ? <><i className="bx bx-loader-alt animate-spin" />Loading</> : "View"}
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                        onClick={() => { setLoadingAdd(resident.id); router.push(`/admin/health-records/${resident.id}/new`) }}
                        disabled={loadingAdd === resident.id}
                      >
                        {loadingAdd === resident.id ? <><i className="bx bx-loader-alt animate-spin" />Loading</> : "+ Record"}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

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
