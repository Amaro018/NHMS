import { invoke } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import createResident from "../mutations/createResident"
import updateResident from "../mutations/updateResident"
import Swal from "sweetalert2"

const inputClass =
  "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 transition"

const labelClass = "block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide"

const ResidentForm = (props: any) => {
  const { resident } = props
  const router = useRouter()
  const isEdit = !!resident

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    address: "",
    contactNumber: "",
  })

  useEffect(() => {
    if (resident) {
      setFormData({
        firstName: resident.firstName || "",
        middleName: resident.middleName || "",
        lastName: resident.lastName || "",
        birthDate: resident.birthDate ? new Date(resident.birthDate).toISOString().split("T")[0] : "",
        gender: resident.gender || "",
        address: resident.address || "",
        contactNumber: resident.contactNumber || "",
      })
    }
  }, [resident])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEdit) {
        await invoke(updateResident, { id: resident.id, ...formData, birthDate: new Date(formData.birthDate) })
        Swal.fire({ icon: "success", title: "Updated", text: "Resident updated successfully!", confirmButtonColor: "#475569" })
      } else {
        await invoke(createResident, { ...formData, birthDate: new Date(formData.birthDate) })
        Swal.fire({ icon: "success", title: "Added", text: "Resident added successfully!", confirmButtonColor: "#475569" })
      }
      router.push("/admin/resident")
      router.refresh()
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to save resident. Please try again.", confirmButtonColor: "#d33" })
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>First Name *</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} required placeholder="Juan" />
          </div>
          <div>
            <label className={labelClass}>Middle Name</label>
            <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className={inputClass} placeholder="Santos" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Last Name *</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} required placeholder="Dela Cruz" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Birth Date *</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass} required>
              <option value="" disabled>Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Purok *</label>
          <select name="address" value={formData.address} onChange={handleChange} className={inputClass} required>
            <option value="" disabled>Select Purok</option>
            <option value="Purok 1">Purok 1</option>
            <option value="Purok 2">Purok 2</option>
            <option value="Purok 3">Purok 3</option>
            <option value="Purok 4">Purok 4</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Contact Number</label>
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={inputClass} placeholder="09XXXXXXXXX" />
        </div>

        <button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors mt-1">
          {isEdit ? "Save Changes" : "Add Resident"}
        </button>
      </form>
    </div>
  )
}

export default ResidentForm
