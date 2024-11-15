"use client"
import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import MailIcon from "@mui/icons-material/Mail"
import Link from "next/link"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import "boxicons/css/boxicons.min.css"
import { Icon } from "@mui/material"
import GitHubIcon from "@mui/icons-material/GitHub"
import FacebookIcon from "@mui/icons-material/Facebook"
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar"
export default function Sidebar() {
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const DrawerList = (
    <Box sx={{ width: 350 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {[
          { text: "Home", href: "/admin/dashboard", icon: "bx bx-home-heart" },
          { text: "Residents", href: "/admin/resident", icon: "bx bxs-user-detail" },
          { text: "Health Records", href: "/admin/health-records", icon: "bx bx-heart" },
          { text: "Projects", href: "/admin/health-projects", icon: "bx bx-check-shield" },
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <Link href={item.href} passHref className="w-full hover:bg-slate-600">
              <ListItemButton component="a">
                <ListItemIcon className="text-2xl">
                  <span className={item.icon}></span>
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {[
          { text: "All mail", href: "/all-mail" },
          { text: "Trash", href: "/trash" },
          { text: "Spam", href: "/spam" },
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <Link href={item.href} passHref className="w-full hover:bg-slate-600">
              <ListItemButton component="a">
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <div className="fixed left-0 top-28">
        <div className="flex flex-col gap-2">
          <div className="block">
            <button
              onClick={toggleDrawer(true)}
              className="bg-slate-600 p-4 rounded-r-md outline-2 shadow-lg hover:bg-slate-500 text-white dark:bg-white dark:text-black dark:hover:bg-slate-500"
            >
              <ViewSidebarIcon />
            </button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
          </div>
          <div className="mt-3">
            <a
              href="https://github.com/jorgeam1993/healthcare-admin"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black p-4 rounded-r-md outline-2 shadow-lg hover:bg-slate-500 text-white dark:bg-white dark:text-black dark:hover:bg-slate-500"
            >
              <GitHubIcon />
            </a>
          </div>

          <div className="mt-6">
            <a
              href="https://github.com/jorgeam1993/healthcare-admin"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 p-4 rounded-r-md outline-2 shadow-lg hover:bg-slate-500 text-white dark:bg-white dark:text-black dark:hover:bg-slate-500"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
