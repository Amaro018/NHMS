"use client"
import { FormControl, InputLabel, MenuItem, NativeSelect, Select } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { Chart } from "chart.js/auto"
import { useQuery } from "@blitzjs/rpc"
import getResidentHealthRecords from "../queries/getResidentHealthRecords"

export default function PieChart() {
  const chartRef = useRef(null)
  const [records] = useQuery(getResidentHealthRecords, {})

  // Get unique years from the records
  const uniqueYears = [
    ...new Set(records.map((record) => new Date(record.dateOfCheckup).getFullYear())),
  ].sort((a, b) => b - a)

  const [selectedYear, setSelectedYear] = useState(uniqueYears[0])

  const uniqueResidents = [...new Set(records.map((record) => record.residentId))]

  const latestRecords = uniqueResidents
    .map((residentId) => {
      const residentRecords = records.filter(
        (record) =>
          record.residentId === residentId &&
          new Date(record.dateOfCheckup).getFullYear() === selectedYear
      )
      return residentRecords.length > 0 ? residentRecords[0] : null
    })
    .filter(Boolean)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const healthStatusCounts = {
    normalWeight: 0,
    underweight: 0,
    overweight: 0,
    obese: 0,
    classIObese: 0,
    classIIObese: 0,
    classIIIObese: 0,
  }

  latestRecords.forEach((record) => {
    if (record.healthStatus === "Normal weight") healthStatusCounts.normalWeight += 1
    else if (record.healthStatus === "Underweight") healthStatusCounts.underweight += 1
    else if (record.healthStatus === "Overweight") healthStatusCounts.overweight += 1
    else if (record.healthStatus === "Obese") healthStatusCounts.obese += 1
    else if (record.healthStatus === "Class I Obese") healthStatusCounts.classIObese += 1
    else if (record.healthStatus === "Class II Obese") healthStatusCounts.classIIObese += 1
    else if (record.healthStatus === "Class III Obese") healthStatusCounts.classIIIObese += 1
  })

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d")

    const pieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: [
          "Normal weight",
          "Underweight",
          "Overweight",
          "Obese",
          "Class I Obese",
          "Class II Obese",
          "Class III Obese",
        ],
        datasets: [
          {
            label: "Health Status",
            data: [
              healthStatusCounts.normalWeight,
              healthStatusCounts.underweight,
              healthStatusCounts.overweight,
              healthStatusCounts.obese,
              healthStatusCounts.classIObese,
              healthStatusCounts.classIIObese,
              healthStatusCounts.classIIIObese,
            ],
            backgroundColor: [
              "#34C759",
              "#F7DC6F",
              "#FFC107",
              "#FF9800",
              "#FF5722",
              "#FF3222",
              "#FF0022",
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "center",
            labels: {
              boxWidth: 30,
              padding: 4,
              usePointStyle: true,
            },
          },
        },
        animations: {
          tension: {
            duration: 1000,
            easing: "linear",
            from: 1,
            to: 0,
            loop: true,
          },
        },
      },
    })

    return () => {
      pieChart.destroy()
    }
  }, [healthStatusCounts])

  return (
    <div className="w-full h-[700px] flex flex-col items-center p-8 mb-10">
      <canvas ref={chartRef} className="w-full"></canvas>
      <div className="w-full flex flex-col items-center justify-center gap-4 p-4">
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            See Records for Year
          </InputLabel>
          <NativeSelect
            defaultValue={selectedYear}
            inputProps={{
              name: "Year",
              id: "uncontrolled-native",
            }}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {" "}
                {year}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </div>
    </div>
  )
}
