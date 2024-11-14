"use client"
import Sidebar from "../components/Sidebar"
import ResidentForm from "../components/ResidentsForm"
import ResidentList from "../components/ResidentsList"

import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import CircularProgress from "@mui/material/CircularProgress" // Import the spinner
import HealthRecordList from "../components/HealthRecordList"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
}

const Residentpage = () => {
  const [loading, setLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  React.useEffect(() => {
    // Simulate data fetching or other async actions
    const fetchData = async () => {
      setLoading(true)
      // Simulate a delay (replace with actual data fetching)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col p-16 text-black bg-white dark:text-white dark:bg-black h-screen">
      <div className="flex justify-between">
        <Sidebar />
      </div>

      {/* Display Loading Spinner or Content */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress color="secondary" /> {/* Loading spinner */}
        </div>
      ) : (
        <>
          <div className="flex flex-col p-4 bg-slate-600 rounded-t-md mt-4">
            <p className="text-2xl text-white font-bold">NAGSIYA RESIDENTS HEALTH RECORDS</p>
          </div>

          <div>
            <HealthRecordList />
          </div>
        </>
      )}
    </div>
  )
}

export default Residentpage
