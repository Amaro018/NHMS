import { useMutation } from "@blitzjs/rpc"
import createHealthRecord from "../mutations/createHealthRecord"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

const HealthRecordForm = ({ resident }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    residentId: resident?.id || "", // Use optional chaining to avoid errors
    firstName: resident?.firstName || "",
    middleName: resident?.middleName || "",
    lastName: resident?.lastName || "",
    dateOfCheckup: "",
    weight: "",
    height: "",
    bmi: "",
    healthStatus: "",
    systolic: "",
    diastolic: "",
    bloodPressureStatus: "",
  })
  const [message, setMessage] = useState("") // For feedback message
  const [addRecord] = useMutation(createHealthRecord)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "weight" || name === "height") {
      const weight = name === "weight" ? Number(value) : Number(formData.weight)
      const height = name === "height" ? Number(value) : Number(formData.height)

      if (weight > 0 && height > 0) {
        const bmi = (weight / (height / 100) ** 2).toFixed(1)
        setFormData((prev) => ({
          ...prev,
          bmi,
          healthStatus: getHealthStatus(bmi),
        }))
      }
    }

    if (name === "systolic" || name === "diastolic") {
      const systolic = name === "systolic" ? Number(value) : Number(formData.systolic)
      const diastolic = name === "diastolic" ? Number(value) : Number(formData.diastolic)

      setFormData((prev) => ({
        ...prev,
        bloodPressureStatus: getBloodPressureStatus(systolic, diastolic),
      }))
    }
  }

  const getHealthStatus = (bmi: string | number) => {
    bmi = parseFloat(bmi)
    if (bmi < 18.5) return "Underweight"
    if (bmi >= 18.5 && bmi <= 24.9) return "Normal weight"
    if (bmi >= 25 && bmi <= 29.9) return "Overweight"
    if (bmi >= 30 && bmi <= 34.9) return "Class I Obese"
    if (bmi >= 35 && bmi <= 39.9) return "Class II Obese"
    if (bmi >= 40) return "Class III Obese"
  }

  const getBloodPressureStatus = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return "Normal"
    if (systolic >= 120 && systolic <= 129 && diastolic < 80) return "Elevated"
    if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89))
      return "Hypertension Stage 1"
    if (systolic >= 140 || diastolic >= 90) return "Hypertension Stage 2"
    if (systolic >= 180 || diastolic >= 120) return "Hypertensive Crisis"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Data to be submitted
    const payload = {
      residentId: resident.id,
      dateOfCheckup: new Date(formData.dateOfCheckup),
      weight: Number(formData.weight),
      height: Number(formData.height),
      bmi: parseFloat(formData.bmi),
      healthStatus: formData.healthStatus,
      systolic: Number(formData.systolic),
      diastolic: Number(formData.diastolic),
      bloodPressureStatus: formData.bloodPressureStatus,
    }

    // Confirm data is correct
    const confirmResult = await Swal.fire({
      icon: "question",
      title: "Confirm Submission",
      text: "Are you sure all information is correct?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit",
      cancelButtonText: "Cancel",
    })

    if (confirmResult.isConfirmed) {
      try {
        // Add the record
        const response = await addRecord(payload)

        if (response) {
          Swal.fire({
            icon: "success",
            title: "Health Record Created",
            text: "Health record has been created successfully.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          })
          router.refresh() // Refresh to fetch latest data
        }
      } catch (error) {
        // Handle any errors
        setMessage("Failed to create health record. Please try again.")
        console.error("Failed to create health record:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to create health record. Please try again.",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 flex flex-col capitalize">
      <h2 className="text-2xl font-bold mb-4">
        Add Health Record for{" "}
        {formData.firstName + " " + formData.middleName + " " + formData.lastName}
      </h2>
      <label htmlFor="dateOfCheckup">CHECK UP DATE :</label>
      <input
        type="date"
        name="dateOfCheckup"
        value={formData.dateOfCheckup}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        value={formData.weight}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="height"
        placeholder="Height (cm)"
        value={formData.height}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      />
      <input
        type="text"
        name="bmi"
        placeholder="BMI"
        value={formData.bmi}
        readOnly
        className="p-2 border rounded"
      />
      <input
        type="text"
        name="healthStatus"
        placeholder="Health Status"
        value={formData.healthStatus}
        onChange={handleChange}
        required
        readOnly
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="systolic"
        placeholder="Systolic (mmHg)"
        value={formData.systolic}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="diastolic"
        placeholder="Diastolic (mmHg)"
        value={formData.diastolic}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      />
      <input
        type="text"
        name="bloodPressureStatus"
        placeholder="Blood Pressure Status"
        value={formData.bloodPressureStatus}
        readOnly
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-600 text-white rounded">
        Save Health Record
      </button>
    </form>
  )
}

export default HealthRecordForm
