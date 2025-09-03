import {useState,useEffect} from 'react';
import axios from '../api/axiosConfig.js';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [payments,setPayments]=useState([]);
    useEffect(()=>{
        const fetchPayments=async()=>{
            try{
                const res=await axios.get('/payment')
                setArticles(res.data);
                console.log(res.data)
                console.log(payments)
            }
            catch(err){
                alert('could not get articles')
            }
        }
        fetchPayments();
    },[])
  return (
    
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">All Payments</h2>
            </div>

  {payments.length === 0 ? (
    <p className="text-gray-500 text-center">No Payments available.</p>
  ) : (
    <div className="space-y-4">
      {payments.map((article) => (
        <div
          key={article._id}
          className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-700">{payments}</h3>
            {/* <Link
              to={`/articleDashboard/${article._id}/edit`}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </Link> */}
          </div>
          {/* <p className="text-gray-600 mt-2 line-clamp-3">{article.content}</p>
          <Link to={`/article/${article._id}`} className="text-blue-600 hover:underline text-sm mt-2 block">
            Read More & Comment →
          </Link> */}
        </div>
      ))}
    </div>
  )}
</div>

      
    
  )
}

export default Dashboard
