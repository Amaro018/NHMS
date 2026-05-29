"use client"
import Link from "next/link"
import Image from "next/image"
import React from "react"
import { LogoutButton } from "../(auth)/components/LogoutButton"

interface NavClientProps {
  currentUser: { role: string; name?: string | null } | null
}

export default function NavClient({ currentUser }: NavClientProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <nav className="bg-slate-700 shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 md:px-12 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image src="/logo3.png" alt="NHMS Logo" width={48} height={48} className="rounded" />
          <span className="text-white font-bold text-lg tracking-wide hidden sm:block">NHMS</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 text-white text-sm font-medium">
          <li>
            <Link href="/" className="hover:text-green-300 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <span className="hover:text-green-300 transition-colors cursor-pointer">About</span>
          </li>
          {currentUser ? (
            currentUser.role === "ADMIN" ? (
              <>
                <li>
                  <Link href="/admin" className="hover:text-green-300 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300 text-xs">{currentUser.name ?? "Admin"}</span>
                    <LogoutButton />
                  </div>
                </li>
              </>
            ) : (
              <li>
                <LogoutButton />
              </li>
            )
          ) : (
            <li>
              <Link
                href="/login"
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition-colors font-semibold"
              >
                Admin Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-md hover:bg-slate-600 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 px-6 pb-4 flex flex-col gap-1 text-white text-sm font-medium border-t border-slate-600">
          <Link
            href="/"
            className="py-2 hover:text-green-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <span className="py-2 hover:text-green-300 transition-colors cursor-pointer">About</span>
          {currentUser ? (
            currentUser.role === "ADMIN" ? (
              <>
                <Link
                  href="/admin"
                  className="py-2 hover:text-green-300 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="py-2">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <div className="py-2">
                <LogoutButton />
              </div>
            )
          ) : (
            <Link
              href="/login"
              className="py-2 text-green-300 font-semibold hover:text-green-200 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
