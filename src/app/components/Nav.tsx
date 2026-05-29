import { invoke } from "../blitz-server"
import getCurrentUser from "../users/queries/getCurrentUser"
import NavClient from "./NavClient"

export default async function Nav() {
  const currentUser = await invoke(getCurrentUser, null)
  return <NavClient currentUser={currentUser} />
}
