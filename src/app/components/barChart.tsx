"use client"
import React, { useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { useQuery } from "@blitzjs/rpc"
import getResidentHealthRecords from "../queries/getResidentHealthRecords"

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

export default function BarChart() {
  const [isYearly, setIsYearly] = useState(false)
  const [records] = useQuery(getResidentHealthRecords, {})

  // Get unique years from the records
  const uniqueYears = [
    ...new Set(records.map((record) => new Date(record.dateOfCheckup).getFullYear())),
  ].sort((a, b) => b - a)

  const uniqueResidents = [...new Set(records.map((record) => record.residentId))]

  const healthStatusCounts = {
    normalWeight: 0,
    underweight: 0,
    overweight: 0,
    obese: 0,
    classIObese: 0,
    classIIObese: 0,
    classIIIObese: 0,
  }

  const chartData = {
    labels: isYearly
      ? uniqueYears
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
    datasets: [
      {
        label: isYearly ? "Yearly Data" : "Monthly Data",
        data: isYearly
          ? [200, 300, 400, 500, 600]
          : [20, 30, 50, 40, 70, 80, 60, 90, 50, 40, 60, 80],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: isYearly ? "Yearly Data Chart" : "Monthly Data Chart",
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <>
      <h1>{isYearly ? "Yearly" : "Monthly"} Bar Chart</h1>
      <button onClick={() => setIsYearly(!isYearly)}>
        Show {isYearly ? "Monthly" : "Yearly"} Data
      </button>
      <Bar data={chartData} options={options} />
    </>
  )
}
