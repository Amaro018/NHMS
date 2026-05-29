"use client"
import logout from "../mutations/logout"
import { useRouter } from "next/navigation"
import { useMutation } from "@blitzjs/rpc"

export function LogoutButton() {
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  return (
    <>
      <button
        className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-3 py-1.5 rounded-md transition-colors"
        onClick={async () => {
          await logoutMutation()
          router.refresh()
        }}
      >
        Logout
      </button>
    </>
  )
}
