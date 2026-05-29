"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Crumb {
  label: string
  href?: string
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-4">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-300">/</span>}
              {isLast || !crumb.href ? (
                <span className={isLast ? "text-slate-700 font-medium" : "text-slate-500"}>
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-slate-700 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          )
        })}
      </nav>

      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors shadow-sm text-sm"
        title="Go back"
      >
        <i className="bx bx-chevron-left text-lg" /> Back
      </button>
    </div>
  )
}
