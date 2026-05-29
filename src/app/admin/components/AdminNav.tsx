"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import "boxicons/css/boxicons.min.css"

const tabs = [
  { label: "Dashboard", href: "/admin", icon: "bx bx-home-heart" },
  { label: "Residents", href: "/admin/resident", icon: "bx bxs-user-detail" },
  { label: "Health Records", href: "/admin/health-records", icon: "bx bx-heart" },
  { label: "Projects", href: "/admin/health-projects", icon: "bx bx-check-shield" },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-slate-200 mt-0">
      <div className="flex overflow-x-auto scrollbar-hide px-4 md:px-8 lg:px-16">
        {tabs.map((tab) => {
          const isActive = tab.href === "/admin"
          ? pathname === "/admin"
          : pathname === tab.href || pathname.startsWith(tab.href + "/")
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${
                  isActive
                    ? "border-slate-700 text-slate-700 bg-slate-50"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              <i className={`${tab.icon} text-lg`} />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
