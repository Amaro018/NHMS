import Link from "next/link"
import { invoke } from "./blitz-server"
import { LogoutButton } from "./(auth)/components/LogoutButton"
import styles from "./styles/Home.module.css"
import getCurrentUser from "./users/queries/getCurrentUser"
import Footer from "./components/Footer"
import PieChart from "./components/pieChart"

export default async function Home() {
  const currentUser = await invoke(getCurrentUser, null)
  return (
    <>
      <div className="flex flex-col">
        <div className={styles.globe} />
        <div className={styles.container}>
          <main className={styles.main}>
            <div className="flex flex-row w-full">
              <div className="flex justify-center p-4 mb-10 w-1/2">
                <PieChart />
              </div>
              <div className="py-8 px-16 w-1/2 text-wrap text-justify flex flex-col gap-4">
                <h1 className="text-4xl font-bold mb-4 text-slate-600">
                  Nagsiya Health Monitoring System
                </h1>
                <p className="text-lg">
                  The Nagsiya Health Monitoring System (NHMS) provides an insightful overview of the
                  health metrics of residents, specifically focusing on weight-related health
                  categories such as normal weight, underweight, overweight, and obesity levels. The
                  system uses visually engaging graphs to make this information accessible and easy
                  to interpret. Through a pie chart, NHMS displays the proportion of residents in
                  each health category. The chart is color-coded, allowing users to quickly grasp
                  the distribution of health statuses within the barangay. For example, residents
                  with a normal weight might be represented by green, while underweight and various
                  obesity classes are shown in shades of yellow, orange, and red. This chart helps
                  community health workers understand the current health landscape at a glance.
                </p>
                <h1 className="text-4xl font-bold mb-4 text-slate-600"> Limitations of BMI</h1>
                <p>
                  Although BMI is a widely used and useful indicator of healthy body weight, it does
                  have its limitations. BMI is only an estimate that cannot take body composition
                  into account. Due to a wide variety of body types as well as distribution of
                  muscle, bone mass, and fat, BMI should be considered along with other measurements
                  rather than being used as the sole method for determining a person's healthy body
                  weight.
                </p>
                <h1 className="text-4xl font-bold mb-4 text-slate-600">Health advice</h1>
                <ul className="">
                  <li>Maintaining a healthy weight is important for your heart health.</li>
                  <li>Moving more can lower your risk factors for heart disease.</li>
                  <li>Eating a healthy diet is the key to heart disease prevention.</li>
                  <li>
                    Tracking your heart health stats can help you meet your heart health goals.
                  </li>
                </ul>
              </div>
            </div>
          </main>
        </div>
        <div className="bottom-0 bg-slate-600 p-4">
          <Footer />
        </div>
      </div>
    </>
  )
}
