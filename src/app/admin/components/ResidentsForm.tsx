import { invoke } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import createResident from "../mutations/createResident"
import updateResident from "../mutations/updateResident" // Make sure you have an update mutation
import { S } from "@blitzjs/auth/dist/index-0ecbee46"
import Swal from "sweetalert2"

const ResidentForm = (props: any) => {
  const { resident } = props
  const router = useRouter()

  // Initialize form data based on whether resident prop is provided (edit mode) or not (add mode)
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
      // Populate form data if resident data is provided for editing
      setFormData({
        firstName: resident.firstName || "",
        middleName: resident.middleName || "",
        lastName: resident.lastName || "",
        birthDate: resident.birthDate
          ? new Date(resident.birthDate).toISOString().split("T")[0]
          : "",
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
      if (resident) {
        // If resident exists, update it
        await invoke(updateResident, {
          id: resident.id,
          ...formData,
          birthDate: new Date(formData.birthDate),
        })
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Resident Updated Successfully!",
        })
      } else {
        // Otherwise, create a new resident
        await invoke(createResident, {
          ...formData,
          birthDate: new Date(formData.birthDate),
        })
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Resident Added Successfully!",
        })
      }

      router.push("/admin/resident")
      router.refresh()
    } catch (error) {
      console.error("Failed to save resident:", error)
      alert("There was an error saving the resident.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        name="middleName"
        placeholder="Middle Name"
        value={formData.middleName}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      >
        <option value="" disabled>
          Select Gender
        </option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <select
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      >
        <option value="" disabled>
          Select Purok
        </option>
        <option value="Purok 1">Purok 1</option>
        <option value="Purok 2">Purok 2</option>
        <option value="Purok 3">Purok 3</option>
        <option value="Purok 4">Purok 4</option>
      </select>
      <input
        type="text"
        name="contactNumber"
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-600 text-white rounded">
        {resident ? "Update Resident" : "Save Resident"}
      </button>
    </form>
  )
}

export default ResidentForm
