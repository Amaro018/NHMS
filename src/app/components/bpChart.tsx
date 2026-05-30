"use client"
import { FormControl, InputLabel, NativeSelect } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { Chart } from "chart.js/auto"
import { useQuery } from "@blitzjs/rpc"
import getResidentHealthRecords from "../queries/getResidentHealthRecords"

const BP_COLORS: Record<string, string> = {
  Hypotension: "#fb923c",
  Normal: "#34C759",
  Elevated: "#facc15",
  "Hypertension Stage 1": "#fca5a5",
  "Hypertension Stage 2": "#f87171",
  "Hypertensive Crisis": "#991b1b",
}

export default function BpChart() {
  const chartRef = useRef(null)
  const [records = [], { isLoading }] = useQuery(getResidentHealthRecords, {}, {
    suspense: false,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  })

  if (isLoading) return <div className="py-16 text-slate-400 text-sm">Loading chart...</div>

  const uniqueYears = [
    ...new Set(records.map((r) => new Date(r.dateOfCheckup).getFullYear())),
  ].sort((a, b) => b - a)

  const [selectedYear, setSelectedYear] = useState(uniqueYears[0])

  const uniqueResidents = [...new Set(records.map((r) => r.residentId))]

  const latestRecords = uniqueResidents
    .map((residentId) => {
      const residentRecords = records.filter(
        (r) =>
          r.residentId === residentId &&
          new Date(r.dateOfCheckup).getFullYear() === selectedYear
      )
      return residentRecords.length > 0 ? residentRecords[0] : null
    })
    .filter(Boolean)

  const counts: Record<string, number> = {
    Hypotension: 0,
    Normal: 0,
    Elevated: 0,
    "Hypertension Stage 1": 0,
    "Hypertension Stage 2": 0,
    "Hypertensive Crisis": 0,
  }

  latestRecords.forEach((r) => {
    if (r.bloodPressureStatus && counts[r.bloodPressureStatus] !== undefined) {
      counts[r.bloodPressureStatus]++
    }
  })

  const labels = Object.keys(counts)
  const data = Object.values(counts)
  const colors = labels.map((l) => BP_COLORS[l])

  useEffect(() => {
    if (!chartRef.current) return
    const ctx = chartRef.current.getContext("2d")

    if (latestRecords.length === 0) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillStyle = "#94a3b8"
      ctx.fillText("No records available", ctx.canvas.width / 2, ctx.canvas.height / 2)
      return
    }

    const chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [{ label: "BP Status", data, backgroundColor: colors, hoverOffset: 4 }],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: { boxWidth: 28, padding: 6, usePointStyle: true },
          },
        },
      },
    })

    return () => chart.destroy()
  }, [counts, latestRecords])

  return (
    <div className="w-full flex flex-col items-center p-4 md:p-8">
      <canvas ref={chartRef} className="w-full" />
      <div className="w-full flex flex-col items-center justify-center gap-4 p-4">
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="bp-year">
            See Records for Year
          </InputLabel>
          <NativeSelect
            defaultValue={selectedYear}
            inputProps={{ name: "Year", id: "bp-year" }}
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
