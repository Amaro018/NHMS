import Sidebar from "../components/Sidebar"

const Dashboard = () => {
  // Only authenticated users can access this page

  return (
    <div className="flex flex-col px-16 text-black bg-white dark:text-white dark:bg-black h-screen">
      <Sidebar />
      <div className="flex flex-col p-4 bg-slate-600 rounded-t-md mt-4">
        <p className="text-2xl text-white font-bold">ADMIN DASHBOARD</p>
      </div>
      <div className="p-2 border border-slate-600 rounded-b-md">
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis quam, molestiae
          repellendus ducimus voluptate vero enim maiores. Delectus unde quis voluptatem ea quo, aut
          similique exercitationem sit quaerat consequatur commodi?
        </p>
      </div>
    </div>
  )
}

export default Dashboard
