export default function HealthProjectForm() {
  return (
    <>
      <main>
        {" "}
        <form className="flex flex-col space-y-4 p-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="p-2 border rounded"
            required
          />
          <input type="date" name="birthDate" className="p-2 border rounded" required />
          <select name="gender" className="p-2 border rounded" required>
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select name="address" className="p-2 border rounded" required>
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
            className="p-2 border rounded"
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </form>
      </main>
    </>
  )
}
