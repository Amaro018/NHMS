import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getRecords from "../../queries/getRecords"

const ResidentHealthRecords = ({ resident }) => {
  // Fetch all records
  const [allRecords] = useQuery(getRecords, {})

  // Filter records for the specific resident
  const records = allRecords.filter((record) => record.residentId === resident.id)

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">
        Health Records for {resident?.firstName} {resident?.lastName}
      </h2>

      {/* Display a message if there are no records */}
      {records.length === 0 ? (
        <p>No health records found for this resident.</p>
      ) : (
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th className="px-6 py-4 font-medium tracking-wider text-gray-900 dark:text-white">
                      Date of Checkup
                    </th>
                    <th className="px-6 py-4 font-medium tracking-wider text-gray-900 dark:text-white">
                      Weight (kg)
                    </th>
                    <th className="px-6 py-4 font-medium tracking-wider text-gray-900 dark:text-white">
                      Height (cm)
                    </th>
                    <th className="px-6 py-4 font-medium tracking-wider text-gray-900 dark:text-white">
                      BMI
                    </th>
                    <th className="px-6 py-4 font-medium tracking-wider text-gray-900 dark:text-white">
                      Health Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b dark:border-neutral-500">
                      <td className="px-6 py-4">
                        {new Date(record.dateOfCheckup).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{record.weight}</td>
                      <td className="px-6 py-4">{record.height}</td>
                      <td className="px-6 py-4">{record.bmi}</td>
                      <td
                        className={`px-6 py-4 ${
                          record.healthStatus === "Normal"
                            ? "text-blue-500"
                            : record.healthStatus === "Underweight"
                            ? "text-orange-400"
                            : ""
                        }`}
                      >
                        {record.healthStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResidentHealthRecords
