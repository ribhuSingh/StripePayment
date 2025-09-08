import React from "react";
import { RiAdminFill } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";
import Register from "./Register";
import { useEffect } from "react";
import { useState } from "react";
import axios from '../api/axiosConfig.js';
const DashboardAdmin = () => {
      const [data, setData] = useState([]);

    useEffect(()=>{
        handleDashboard();
    },[])
     const navigate = useNavigate();
     const handleDashboard= async() =>{
        try{
         const res =   await axios.get('/dashboardInfo/allData?page=1&limit=10');
         console.log("Api res",res.data);
         setData(res.data.data);
         
           
        }
        catch(error){
            alert(error.response?.data?.msg || "Something Horribly went Wrong")
        }
     }

  
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
              <th className="py-3 px-4 text-left">Payment Id</th>
              {/* <th className="py-3 px-4 text-left">Payment Id</th> */}
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Project Url</th>
              {/* <th className="py-3 px-4 text-left">Project Id</th> */}
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              {/* <th className="py-3 px-4 text-left">Project Url</th>{" "} */}
              <th className="py-3 px-4 text-left">Amount</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
           {data.length>0?(
            data.map((item) => {
              const dateObj = new Date(item.created_at);
              return (
                <tr
                  key={item.payment_id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-3 px-4">{item.payment_id}</td>
                  <td className="py-3 px-4">{item.user_email}</td>
                  <td className="py-3 px-4">
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.project_url}
                    </a>
                  </td>
                  <td className="py-3 px-4">{item.status}</td>
                  <td className="py-3 px-4">{dateObj.toLocaleDateString()}</td>
                  <td className="py-3 px-4">{dateObj.toLocaleTimeString()}</td>
                  <td className="py-3 px-4">₹{item.amount}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="py-3 px-4 text-center" colSpan={7}>
                No records found
              </td>
            </tr>
          )}
         
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAdmin;
