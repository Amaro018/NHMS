"use client"
import { useEffect, useRef } from "react"
import { Chart } from "chart.js/auto"

export default function BmiTrendChart({ records }: { records: any[] }) {
  const chartRef = useRef(null)

  const sorted = [...records].sort((a, b) => new Date(a.dateOfCheckup).getTime() - new Date(b.dateOfCheckup).getTime())
  const labels = sorted.map(r => new Date(r.dateOfCheckup).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))
  const bmis = sorted.map(r => r.bmi)

  useEffect(() => {
    if (!chartRef.current || sorted.length === 0) return
    const chart = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "BMI",
          data: bmis,
          borderColor: "#475569",
          backgroundColor: "rgba(71,85,105,0.1)",
          pointBackgroundColor: "#475569",
          tension: 0.3,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: "BMI" },
          },
        },
      },
    })
    return () => chart.destroy()
  }, [records])

  if (sorted.length < 2) return null

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <i className="bx bx-line-chart text-lg text-slate-400" /> BMI Trend
      </h3>
      <canvas ref={chartRef} />
    </div>
  )
}
