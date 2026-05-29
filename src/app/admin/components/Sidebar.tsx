"use client"
import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Link from "next/link"
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar"
import { usePathname } from "next/navigation"
import "boxicons/css/boxicons.min.css"

const navItems = [
  { text: "Dashboard", href: "/admin", icon: "bx bx-home-heart" },
  { text: "Residents", href: "/admin/resident", icon: "bx bxs-user-detail" },
  { text: "Health Records", href: "/admin/health-records", icon: "bx bx-heart" },
  { text: "Projects", href: "/admin/health-projects", icon: "bx bx-check-shield" },
]

export default function Sidebar() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen)

  const DrawerList = (
    <Box sx={{ width: 280 }} role="presentation" onClick={toggleDrawer(false)}>
      {/* Drawer header */}
      <div className="bg-slate-700 px-4 py-5 flex items-center gap-3">
        <i className="bx bx-menu text-white text-2xl" />
        <span className="text-white font-bold text-base tracking-wide">Admin Panel</span>
      </div>

      <List sx={{ pt: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <ListItem key={item.text} disablePadding>
              <Link href={item.href} passHref className="w-full">
                <ListItemButton
                  component="a"
                  sx={{
                    borderRadius: "6px",
                    mx: 1,
                    mb: 0.5,
                    backgroundColor: isActive ? "rgba(71,85,105,0.15)" : "transparent",
                    borderLeft: isActive ? "3px solid #475569" : "3px solid transparent",
                    "&:hover": { backgroundColor: "rgba(71,85,105,0.1)" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <span
                      className={`${item.icon} text-2xl`}
                      style={{ color: isActive ? "#475569" : "#64748b" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#1e293b" : "#334155",
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          )
        })}
      </List>

      <div className="mx-4 mt-auto pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-400 text-center pb-2">NHMS © 2024</p>
      </div>
    </Box>
  )

  return (
    <>
      <div className="fixed left-0 top-24 z-40">
        <button
          onClick={toggleDrawer(true)}
          title="Open navigation"
          className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-r-lg shadow-lg transition-colors"
        >
          <ViewSidebarIcon fontSize="small" />
        </button>
      </div>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  )
}
