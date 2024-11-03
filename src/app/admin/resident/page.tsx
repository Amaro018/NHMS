"use client"
import Sidebar from "../components/Sidebar"
import ResidentForm from "../components/ResidentsForm"
import ResidentList from "../components/ResidentsList"

import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import { BorderColor } from "@mui/icons-material"

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
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  // Only authenticated users can access this page

  return (
    <div className="flex flex-col p-16 text-black bg-white dark:text-white dark:bg-black h-screen">
      <div className="flex justify-between">
        <Sidebar />
        <button
          className="bg-slate-600 p-4 rounded-md outline-2 shadow-lg hover:bg-slate-500 text-white dark:bg-white dark:text-black"
          onClick={handleOpen}
        >
          Add Resident
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="p-2">
              <ResidentForm />
            </div>
          </Box>
        </Modal>
      </div>

      <div className="flex flex-col p-4 bg-slate-600 rounded-t-md mt-4">
        <p className="text-2xl text-white font-bold">NAGSIYA RESIDENTS</p>
      </div>

      <div>
        <ResidentList />
      </div>
    </div>
  )
}

export default Residentpage
