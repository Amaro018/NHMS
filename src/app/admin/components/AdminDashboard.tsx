"use client"
import { useQuery } from "@blitzjs/rpc"
import getResidentCount from "./../queries/getResidentCount"

export default function AdminDashboard() {
  const [residentCount, { refetch }] = useQuery(getResidentCount, {})
  return (
    <div>
      <div className="flex flex-col p-4 bg-slate-600 rounded-t-md mt-4">
        <p className="text-2xl text-white font-bold">ADMIN DASHBOARD</p>
      </div>
      <div className="p-2 border border-slate-600 rounded-b-md">
        <div className="flex flex-row gap-4 w-full">
          <div className="bg-white rounded-md shadow-md p-4 flex flex-row justify-between w-full">
            <div>
              <p className="text-xl font-bold">Residents</p>
              <p className="text-gray-600">Total residents</p>
            </div>
            <div>
              <p className="text-5xl font-bold">{residentCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-md shadow-md p-4 flex flex-row justify-between w-full">
            <div>
              <p className="text-xl font-bold">Health Records</p>
              <p className="text-gray-600">Total health records</p>
            </div>
            <div>
              <p className="text-5xl font-bold">0</p>
            </div>
          </div>
          <div className="bg-white rounded-md shadow-md p-4 w-full">
            <p className="text-xl font-bold">Health Projects</p>
            <p className="text-gray-600">View and manage health projects</p>
          </div>
        </div>
      </div>
    </div>
  )
}
