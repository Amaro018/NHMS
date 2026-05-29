"use client"
import { useEffect, useState } from "react"

export type ToastType = "success" | "error" | "info"

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300) }, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  const colors = {
    success: "bg-green-600",
    error: "bg-red-500",
    info: "bg-slate-700",
  }
  const icons = { success: "bx-check-circle", error: "bx-x-circle", info: "bx-info-circle" }

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all duration-300 ${colors[type]} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <i className={`bx ${icons[type]} text-xl`} />
      {message}
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="ml-2 opacity-70 hover:opacity-100">
        <i className="bx bx-x text-lg" />
      </button>
    </div>
  )
}

// Global toast hook
let _setToast: any = null

export function ToastProvider() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  _setToast = setToast
  if (!toast) return null
  return <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
}

export function showToast(message: string, type: ToastType = "success") {
  _setToast?.({ message, type })
}
