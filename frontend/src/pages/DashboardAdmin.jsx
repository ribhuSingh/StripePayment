import React from "react";
import { RiAdminFill } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";
import Register from "./Register";
const DashboardAdmin = () => {
     const navigate = useNavigate();
  // Dummy data (replace later with API call)
  const data = [
    {
      id: 1,
      name: "Saksham Sharma",
      email: "saksham@example.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Komal Preet",
      email: "komal@example.com",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Aditya Rathore",
      email: "aditya@example.com",
      status: "Active",
    },
    {
      id: 4,
      name: "Deepak Saini",
      email: "deepak@example.com",
      status: "Active",
    },
    
  ];
    const   handleRegister=()=>{
        navigate("/register")
    }
  return (
    <div className=" bg-gray-100 min-h-screen container-fluid pt-6">
        <div className="flex justify-between items-center bg-white shadow-md rounded-lg px-6 py-4 mb-6">
      {/* Left: Dashboard Title */}
      <h2 className="flex items-center text-2xl font-bold text-gray-700">
        <span className="text-blue-600 mr-2 text-3xl">
          <RiAdminFill />
        </span>
        Admin Dashboard
      </h2>

      {/* Right: Button */}
      <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition " onClick={handleRegister}>
         Register User
      </button>
    </div>
      <div className="overflow-x-auto mx-auto container-fluid">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              {/* <th className="py-3 px-4 text-left">Payment Id</th> */}
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Payment Id</th>
              <th className="py-3 px-4 text-left">Project Id</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              {/* <th className="py-3 px-4 text-left">Project Url</th>{" "} */}
              <th className="py-3 px-4 text-left">Amount</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {data.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
              
                 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAdmin;
