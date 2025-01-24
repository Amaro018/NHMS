import React from "react"
import CircularProgress from "@mui/material/CircularProgress"

const Loading = ({ size = 200, color = "green", message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <CircularProgress size={size} color={color} className="mt-24" />
      <p>{message}</p>
    </div>
  )
}

export default Loading
