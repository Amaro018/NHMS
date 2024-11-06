import Link from "next/link"
import Image from "next/image"
import React from "react"
import logo from "../logo2.png"
import { invoke } from "../blitz-server"
import { LogoutButton } from "../(auth)/components/LogoutButton"
// import styles from "./styles/Home.module.css"
import getCurrentUser from "../users/queries/getCurrentUser"

export default async function Nav() {
  const currentUser = await invoke(getCurrentUser, null)
  return (
    <nav>
      <div className="flex justify-between py-4 px-16 bg-slate-600 items-center text-white">
        <div className="flex gap-4 items-center">
          <img src="/logo3.png" alt="Logo" width="150" height="150" />
        </div>
        <ul className="flex gap-4">
          <li>
            <Link href={"/"} className="hover:text-green-300">
              Home
            </Link>
          </li>
          <li className="hover:text-green-300">About</li>
          <li>
            <div>
              {currentUser ? (
                currentUser.role === "ADMIN" ? (
                  <>
                    <div className="flex flex-row items-center gap-4">
                      <div className="flex flex-row gap-4">
                        <Link href={"/admin/dashboard"} className="hover:text-green-300">
                          <p>Dashboard</p>
                        </Link>
                      </div>
                      <LogoutButton />
                    </div>
                  </>
                ) : (
                  <div>
                    <p>Home</p>
                    <p className="hover:text-green-300">
                      <LogoutButton />
                    </p>
                  </div>
                  // Display the user role if not ADMIN
                )
              ) : (
                <div className="flex gap-4">
                  {/* <Link href="/signup">
                    <strong>Sign Up</strong>
                  </Link>
                  <Link href="/login">
                    <strong>Login</strong>
                  </Link> */}
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  )
}
