"use client"
import { useState, useEffect } from "react"
import SkewLoader from "react-spinners/ClipLoader"

function App() {
  const [loading, setLoading] = useState(true)

  // Toggle loading state every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLoading((prevLoading) => !prevLoading)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="sweet-loading flex flex-col justify-center items-center">
      <SkewLoader
        color="#22c55e" // Hex code for Tailwind green-500
        loading={loading} // Control the loading state
        size={150}
        speedMultiplier={1}
        aria-label="Loading Spinner"
      />
    </div>
  )
}

export default App
