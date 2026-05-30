"use client"
import { FormControl, InputLabel, NativeSelect } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { Chart } from "chart.js/auto"
import { useQuery } from "@blitzjs/rpc"
import getResidentHealthRecords from "../queries/getResidentHealthRecords"

export default function PieChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [records = []] = useQuery(getResidentHealthRecords, {}, {
    suspense: false,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  })

  const uniqueYears = [...new Set(records.map((r) => new Date(r.dateOfCheckup).getFullYear()))].sort((a, b) => b - a)
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)

  const activeYear = selectedYear ?? uniqueYears[0]

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const uniqueResidents = [...new Set(records.map((r) => r.residentId))]
    const latestRecords = uniqueResidents
      .map((id) => {
        const res = records.filter(
          (r) => r.residentId === id && new Date(r.dateOfCheckup).getFullYear() === activeYear
        )
        return res[0] ?? null
      })
      .filter(Boolean)

    if (latestRecords.length === 0) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillStyle = "#94a3b8"
      ctx.fillText("No records available", ctx.canvas.width / 2, ctx.canvas.height / 2)
      return
    }

    const counts = { normalWeight: 0, underweight: 0, overweight: 0, obese: 0, classIObese: 0, classIIObese: 0, classIIIObese: 0 }
    latestRecords.forEach((r) => {
      if (r.healthStatus === "Normal weight") counts.normalWeight++
      else if (r.healthStatus === "Underweight") counts.underweight++
      else if (r.healthStatus === "Overweight") counts.overweight++
      else if (r.healthStatus === "Obese") counts.obese++
      else if (r.healthStatus === "Class I Obese") counts.classIObese++
      else if (r.healthStatus === "Class II Obese") counts.classIIObese++
      else if (r.healthStatus === "Class III Obese") counts.classIIIObese++
    })

    const chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Normal weight", "Underweight", "Overweight", "Obese", "Class I Obese", "Class II Obese", "Class III Obese"],
        datasets: [{
          label: "Health Status",
          data: [counts.normalWeight, counts.underweight, counts.overweight, counts.obese, counts.classIObese, counts.classIIObese, counts.classIIIObese],
          backgroundColor: ["#34C759", "#F7DC6F", "#FFC107", "#FF9800", "#FF5722", "#FF3222", "#FF0022"],
          hoverOffset: 4,
        }],
      },
      options: {
        plugins: {
          legend: { display: true, position: "top", align: "center", labels: { boxWidth: 30, padding: 4, usePointStyle: true } },
        },
      },
    })

    return () => chart.destroy()
  }, [records, activeYear])

  return (
    <div className="w-full flex flex-col items-center p-4 md:p-8">
      <canvas ref={chartRef} className="w-full" />
      <div className="w-full flex flex-col items-center justify-center gap-4 p-4">
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="pie-year">See Records for Year</InputLabel>
          <NativeSelect
            defaultValue={activeYear}
            inputProps={{ name: "Year", id: "pie-year" }}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {uniqueYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </NativeSelect>
        </FormControl>
      </div>
    </div>
  )
}
