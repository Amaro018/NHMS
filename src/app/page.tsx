import Link from "next/link"
import { invoke } from "./blitz-server"
import { LogoutButton } from "./(auth)/components/LogoutButton"
import styles from "./styles/Home.module.css"
import getCurrentUser from "./users/queries/getCurrentUser"
import Footer from "./components/Footer"

export default async function Home() {
  const currentUser = await invoke(getCurrentUser, null)
  return (
    <>
      <div className={styles.globe} />
      <div className={styles.container}>
        <main className={styles.main}></main>

        <Footer />
      </div>
    </>
  )
}
