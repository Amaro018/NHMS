import { useQuery } from "@blitzjs/rpc"
import getResidents from "../queries/getResidents"
import getRecords from "../queries/getRecords"
import * as React from "react"

export default function HealthRecordList() {
  const [residents, { refetch }] = useQuery(getResidents, null)
  const [records] = useQuery(getRecords, null)

  return (
    <div className="overflow-x-auto py-4">
      <div className="py-4">
        <input
          type="text"
          placeholder="Search by Last or First name"
          className="p-2 border rounded"
        />
      </div>

      <table className="min-w-full rounded-md border border-slate-600">
        <thead>
          <tr>
            <th className="py-2 border-b cursor-pointer border-slate-600">
              Name<i className="bx bxs-sort-alt"></i>
            </th>
            <th className=" py-2 border-b cursor-pointer border-slate-600">Age</th>
            <th className="py-2 border-b cursor-pointer border-slate-600">Height</th>
            <th className="py-2 border-b cursor-pointer border-slate-600">Weight</th>
            <th className="py-2 border-b border-slate-600">BMI</th>
            <th className="py-2 border-b border-slate-600">Health Status</th>
            <th className="py-2 border-b border-slate-600">Last Checkup</th>
            <th className="py-2 border-b border-slate-600">Action</th>
          </tr>
        </thead>
        <tbody className="text-center capitalize">
          {residents.map((resident) => {
            const latestRecord = records
              .filter((record) => record.residentId === resident.id)
              .sort((a, b) => new Date(b.dateOfCheckup) - new Date(a.dateOfCheckup))[0]

            return (
              <tr key={resident.id}>
                <td className="py-2 border-b border-slate-600">
                  {resident.lastName}, {resident.firstName}
                </td>
                <td className=" py-2 border-b border-slate-600">
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
                <td className="py-2 border-b border-slate-600">
                  {latestRecord ? latestRecord.height : "N/A"}
                </td>
                <td className="py-2 border-b border-slate-600">
                  {latestRecord ? latestRecord.weight : "N/A"}
                </td>
                <td className="py-2 border-b border-slate-600">
                  {latestRecord ? latestRecord.bmi : "N/A"}
                </td>

                <td className="py-2 border-b border-slate-600">
                  {latestRecord ? latestRecord.healthStatus : "N/A"}
                </td>

                <td className="py-2 border-b border-slate-600">
                  {latestRecord
                    ? new Date(latestRecord.dateOfCheckup).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </td>

                <td className="py-2 border-b border-slate-600">
                  <button className="bg-blue-600 p-2 rounded-md text-white hover:bg-blue-500">
                    View
                  </button>
                  <button className="bg-green-600 p-2 rounded-md text-white ml-2 hover:bg-green-500">
                    Add Record
                  </button>
                  <button className="bg-red-600 p-2 rounded-md text-white ml-2 hover:bg-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
