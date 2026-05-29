import React from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import getRecords from "../../queries/getRecords"
import deleteRecord from "../../mutations/deleteHealthRecord"
import Swal from "sweetalert2"

const healthStatusColor = (status: string) => {
  switch (status) {
    case "Normal weight": return "text-green-600 bg-green-50"
    case "Underweight": return "text-yellow-600 bg-yellow-50"
    case "Overweight": return "text-orange-500 bg-orange-50"
    case "Class I Obese": return "text-red-400 bg-red-50"
    case "Class II Obese": return "text-red-500 bg-red-50"
    case "Class III Obese": return "text-red-700 bg-red-50"
    default: return "text-slate-600 bg-slate-50"
  }
}

const bpStatusColor = (status: string) => {
  switch (status) {
    case "Normal": return "text-green-600 bg-green-50"
    case "Hypotension": return "text-yellow-600 bg-yellow-50"
    case "Elevated": return "text-orange-500 bg-orange-50"
    case "Hypertension Stage 1": return "text-red-400 bg-red-50"
    case "Hypertension Stage 2": return "text-red-500 bg-red-50"
    case "Hypertensive Crisis": return "text-red-700 bg-red-50"
    default: return "text-slate-600 bg-slate-50"
  }
}

const ResidentHealthRecords = ({ resident }) => {
  const [allRecords, { refetch }] = useQuery(getRecords, {})
  const records = allRecords
    .filter((r) => r.residentId === resident.id)
    .sort((a, b) => new Date(b.dateOfCheckup).getTime() - new Date(a.dateOfCheckup).getTime())

  const [deleteHealthRecord] = useMutation(deleteRecord)

  const handleDelete = async (recordId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this record?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: { popup: "swal-high-zindex" },
    })
    if (result.isConfirmed) {
      try {
        await deleteHealthRecord({ healthRecordId: recordId, residentId: resident.id })
        await refetch()
        Swal.fire({ icon: "success", title: "Deleted", confirmButtonColor: "#475569", customClass: { popup: "swal-high-zindex" } })
      } catch {
        Swal.fire({ icon: "error", title: "Error", text: "Failed to delete record.", confirmButtonColor: "#d33", customClass: { popup: "swal-high-zindex" } })
      }
    }
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <i className="bx bx-heart text-6xl" />
        <p className="text-lg font-medium">No health records yet</p>
        <p className="text-sm">Click "+ Add Record" to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-700">{records.length} Record{records.length !== 1 ? "s" : ""}</p>
          <p className="text-xs text-slate-400 mt-0.5">Most recent first</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Weight</th>
              <th className="px-5 py-3 text-left">Height</th>
              <th className="px-5 py-3 text-left">BMI</th>
              <th className="px-5 py-3 text-left">Health Status</th>
              <th className="px-5 py-3 text-left">BP Status</th>
              <th className="px-5 py-3 text-left">BP Reading</th>
              <th className="px-5 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                  {new Date(record.dateOfCheckup).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-5 py-3 text-slate-600">{record.weight} kg</td>
                <td className="px-5 py-3 text-slate-600">{record.height} cm</td>
                <td className="px-5 py-3 font-semibold text-slate-700">{record.bmi}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${healthStatusColor(record.healthStatus)}`}>
                    {record.healthStatus}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${bpStatusColor(record.bloodPressureStatus)}`}>
                    {record.bloodPressureStatus || "—"}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500 font-mono text-xs">
                  {record.systolic && record.diastolic ? `${record.systolic}/${record.diastolic}` : "—"}
                </td>
                <td className="px-5 py-3">
                  <button
                    className="text-red-400 hover:text-red-600 transition-colors"
                    onClick={() => handleDelete(record.id)}
                    title="Delete record"
                  >
                    <i className="bx bx-trash text-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResidentHealthRecords
