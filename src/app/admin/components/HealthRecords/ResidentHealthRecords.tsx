import React, { useState } from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import getRecords from "../../queries/getRecords"
import deleteRecord from "../../mutations/deleteHealthRecord"
import Swal from "sweetalert2"

const ResidentHealthRecords = ({ resident }) => {
  // Fetch all records
  const [allRecords, { refetch }] = useQuery(getRecords, {})

  // Filter records for the specific resident
  const records = allRecords.filter((record) => record.residentId === resident.id)

  const [deleteHealthRecord] = useMutation(deleteRecord)

  const handleDelete = async (recordId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Do you really want to delete this health record?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        popup: "swal-high-zindex", // Custom class for high z-index
      },
      backdrop: `rgba(0, 0, 0, 0.4)`, // Dim background
    })

    if (result.isConfirmed) {
      try {
        await deleteHealthRecord({ healthRecordId: recordId, residentId: resident.id })
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Health record has been deleted successfully.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          customClass: {
            popup: "swal-high-zindex",
          },
        })
        await refetch()
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while deleting the record.",
          confirmButtonColor: "#d33",
          confirmButtonText: "Try Again",
          customClass: {
            popup: "swal-high-zindex",
          },
        })
      }
    }
  }

  return (
    <div className="flex flex-col z-1">
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
                      Blood Pressure
                    </th>
                    <th className="px-6 py-4 font-medium tracking-wider text-gray-900 dark:text-white">
                      Health Status
                    </th>
                    <th className="px-6 py-4 font-medium tracking-wider text-gray-900 dark:text-white">
                      Action
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
                      <td className="px-6 py-4">{record.bloodPressureStatus}</td>

                      <td
                        className={`px-6 py-4 ${
                          record.healthStatus === "Normal weight"
                            ? "text-blue-500"
                            : record.healthStatus === "Underweight"
                            ? "text-orange-400"
                            : record.healthStatus === "Overweight"
                            ? "text-yellow-500"
                            : record.healthStatus === "Obese"
                            ? "text-red-500"
                            : record.healthStatus === "Class I Obese"
                            ? "text-red-500"
                            : record.healthStatus === "Class II Obese"
                            ? "text-red-500"
                            : record.healthStatus === "Class III Obese"
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {record.healthStatus}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="text-red-500 hover:text-red-700 text-2xl"
                          onClick={() => handleDelete(record.id)}
                        >
                          <i className="bx bx-trash"></i>
                        </button>
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
