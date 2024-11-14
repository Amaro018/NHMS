import React from "react"
import CircularProgress from "@mui/material/CircularProgress"

const Loading = ({ size = 40, color = "secondary", message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <CircularProgress size={size} color={color} />
      <p>{message}</p>
    </div>
  )
}

export default Loading
