"use client"
import { useEffect, useRef, useState } from "react"
import { Chart } from "chart.js/auto"
import { useQuery } from "@blitzjs/rpc"
import getResidentHealthRecords from "../../queries/getResidentHealthRecords"

const YEARS = () => {
  const cur = new Date().getFullYear()
  return [cur, cur - 1, cur - 2].filter(y => y > 2000)
}

export default function MonthlyTrendChart() {
  const chartRef = useRef(null)
  const [records] = useQuery(getResidentHealthRecords, {})
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const monthlyCounts = months.map((_, i) =>
    records.filter(r => {
      const d = new Date(r.dateOfCheckup)
      return d.getFullYear() === selectedYear && d.getMonth() === i
    }).length
  )

  useEffect(() => {
    if (!chartRef.current) return
    const chart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: months,
        datasets: [{
          label: "Health Records",
          data: monthlyCounts,
          backgroundColor: "rgba(71,85,105,0.7)",
          borderRadius: 6,
          hoverBackgroundColor: "rgba(71,85,105,0.9)",
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
      },
    })
    return () => chart.destroy()
  }, [monthlyCounts, selectedYear])

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <i className="bx bx-bar-chart-alt-2 text-lg text-slate-400" /> Health Records per Month
        </h3>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          {YEARS().map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <canvas ref={chartRef} />
    </div>
  )
}
