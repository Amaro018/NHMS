"use client"
import Sidebar from "../components/Sidebar"
import * as React from "react"
import { Box, Modal } from "@mui/material"
import HealthProjectForm from "../components/HealthProjects/healthProjectForm"
import HealthProjectList from "../components/HealthProjects/HealthProjectList"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
}
export default function HealthProjects() {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <div className="flex flex-col px-16 text-black bg-white dark:text-white dark:bg-black h-screen">
      <div className="flex justify-end">
        <Sidebar />
        <button
          className="bg-slate-600 p-4 rounded-md outline-2 shadow-lg hover:bg-slate-500 text-white dark:bg-white dark:text-black"
          onClick={handleOpen}
        >
          Add Project
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="p-2">
              <HealthProjectForm project={undefined} />
            </div>
          </Box>
        </Modal>
      </div>
      <div className="flex flex-col p-4 bg-slate-600 rounded-t-md mt-4">
        <p className="text-2xl text-white font-bold">HEALTH PROJECTS LIST</p>
      </div>
      <div>
        <HealthProjectList />
      </div>
    </div>
  )
}
