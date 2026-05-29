import { useMutation } from "@blitzjs/rpc"
import createHealthRecord from "../mutations/createHealthRecord"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { useConfirmLeave } from "../hooks/useConfirmLeave"

const input =
  "w-full px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 transition bg-white"
const lbl = "block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide"

const bmiColor = (status: string) => {
  switch (status) {
    case "Normal weight": return "bg-green-50 text-green-700 border-green-200"
    case "Underweight": return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "Overweight": return "bg-orange-50 text-orange-700 border-orange-200"
    case "Class I Obese": return "bg-red-50 text-red-400 border-red-200"
    case "Class II Obese": return "bg-red-50 text-red-600 border-red-200"
    case "Class III Obese": return "bg-red-100 text-red-800 border-red-300"
    default: return "bg-slate-50 text-slate-400 border-slate-200"
  }
}

const bpColor = (status: string) => {
  switch (status) {
    case "Normal": return "bg-green-50 text-green-700 border-green-200"
    case "Hypotension": return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "Elevated": return "bg-orange-50 text-orange-700 border-orange-200"
    case "Hypertension Stage 1": return "bg-red-50 text-red-400 border-red-200"
    case "Hypertension Stage 2": return "bg-red-50 text-red-600 border-red-200"
    case "Hypertensive Crisis": return "bg-red-100 text-red-800 border-red-300"
    default: return "bg-slate-50 text-slate-400 border-slate-200"
  }
}

const HealthRecordForm = ({ resident, onSuccess }) => {
  const router = useRouter()
  const [addRecord] = useMutation(createHealthRecord)
  const [isDirty, setIsDirty] = useState(false)
  useConfirmLeave(isDirty)
  const [formData, setFormData] = useState({
    dateOfCheckup: "",
    weight: "",
    height: "",
    bmi: "",
    healthStatus: "",
    systolic: "",
    diastolic: "",
    bloodPressureStatus: "",
  })

  const getHealthStatus = (bmi: number) => {
    if (bmi < 18.5) return "Underweight"
    if (bmi <= 24.9) return "Normal weight"
    if (bmi <= 29.9) return "Overweight"
    if (bmi <= 34.9) return "Class I Obese"
    if (bmi <= 39.9) return "Class II Obese"
    return "Class III Obese"
  }

  const getBPStatus = (sys: number, dia: number) => {
    if (sys < 90 && dia < 60) return "Hypotension"
    if (sys < 120 && dia < 80) return "Normal"
    if (sys <= 129 && dia < 80) return "Elevated"
    if (sys <= 139 || (dia >= 80 && dia <= 89)) return "Hypertension Stage 1"
    if (sys < 180 || dia < 120) return "Hypertension Stage 2"
    return "Hypertensive Crisis"
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setIsDirty(true)
    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      const w = name === "weight" ? Number(value) : Number(prev.weight)
      const h = name === "height" ? Number(value) : Number(prev.height)
      if (w > 0 && h > 0) {
        const bmi = parseFloat((w / (h / 100) ** 2).toFixed(1))
        next.bmi = String(bmi)
        next.healthStatus = getHealthStatus(bmi)
      }
      const sys = name === "systolic" ? Number(value) : Number(prev.systolic)
      const dia = name === "diastolic" ? Number(value) : Number(prev.diastolic)
      if (sys > 0 && dia > 0) next.bloodPressureStatus = getBPStatus(sys, dia)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const confirm = await Swal.fire({
      icon: "question",
      title: "Confirm Submission",
      text: "Are you sure all information is correct?",
      showCancelButton: true,
      confirmButtonColor: "#475569",
      cancelButtonColor: "#d33",
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
    })
    if (!confirm.isConfirmed) return
    try {
      await addRecord({
        residentId: resident.id,
        dateOfCheckup: new Date(formData.dateOfCheckup),
        weight: Number(formData.weight),
        height: Number(formData.height),
        bmi: parseFloat(formData.bmi),
        healthStatus: formData.healthStatus,
        systolic: Number(formData.systolic),
        diastolic: Number(formData.diastolic),
        bloodPressureStatus: formData.bloodPressureStatus,
      })
      setIsDirty(false)
      onSuccess()
      Swal.fire({ icon: "success", title: "Record Saved", confirmButtonColor: "#475569" })
      router.refresh()
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to save record.", confirmButtonColor: "#d33" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left column — inputs */}
      <div className="lg:col-span-2 flex flex-col gap-5">

        {/* Checkup Date */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <i className="bx bx-calendar text-lg text-slate-400" /> Checkup Date
          </h3>
          <div>
            <label className={lbl}>Date *</label>
            <input type="date" name="dateOfCheckup" value={formData.dateOfCheckup}
              onChange={handleChange} required className={input}
              max={new Date().toISOString().split("T")[0]} />
          </div>
        </div>

        {/* Vital Signs */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <i className="bx bx-body text-lg text-slate-400" /> Vital Signs
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Weight (kg) *</label>
              <input type="number" name="weight" value={formData.weight}
                onChange={handleChange} required min={1} placeholder="e.g. 60"
                className={input} />
            </div>
            <div>
              <label className={lbl}>Height (cm) *</label>
              <input type="number" name="height" value={formData.height}
                onChange={handleChange} required min={1} placeholder="e.g. 160"
                className={input} />
            </div>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <i className="bx bx-heart text-lg text-slate-400" /> Blood Pressure
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Systolic (mmHg) *</label>
              <input type="number" name="systolic" value={formData.systolic}
                onChange={handleChange} required min={1} placeholder="e.g. 120"
                className={input} />
            </div>
            <div>
              <label className={lbl}>Diastolic (mmHg) *</label>
              <input type="number" name="diastolic" value={formData.diastolic}
                onChange={handleChange} required min={1} placeholder="e.g. 80"
                className={input} />
            </div>
          </div>
        </div>
      </div>

      {/* Right column — results + submit */}
      <div className="flex flex-col gap-5">

        {/* Resident info */}
        <div className="bg-slate-700 rounded-xl p-5 text-white">
          <p className="text-xs text-slate-300 uppercase tracking-wide mb-1">Recording for</p>
          <p className="font-bold text-lg capitalize">
            {resident?.firstName} {resident?.middleName} {resident?.lastName}
          </p>
          <p className="text-slate-300 text-xs mt-0.5">{resident?.address}</p>
        </div>

        {/* Auto-calculated results */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <i className="bx bx-analyse text-lg text-slate-400" /> Results
          </h3>

          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">BMI</p>
            <p className="text-3xl font-bold text-slate-700">{formData.bmi || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">Health Status</p>
            <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold border ${formData.healthStatus ? bmiColor(formData.healthStatus) : "bg-slate-50 text-slate-400 border-slate-200"}`}>
              {formData.healthStatus || "Enter weight & height"}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">BP Status</p>
            <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold border ${formData.bloodPressureStatus ? bpColor(formData.bloodPressureStatus) : "bg-slate-50 text-slate-400 border-slate-200"}`}>
              {formData.bloodPressureStatus || "Enter BP readings"}
            </span>
          </div>
        </div>

        <button type="submit"
          className="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm">
          Save Health Record
        </button>
      </div>

    </form>
  )
}

export default HealthRecordForm
