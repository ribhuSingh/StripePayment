import axios from '../api/axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Register=()=>{
    const [username,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();
    const handleRegister=async()=>{
        try{
            await axios.post('/auth/register',{username,email,password});
            navigate('/dashboard')
        }
        catch(error){
            alert(error.response?.data?.msg || 'Registration Failed')
        }
    }
    return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

        <div className="space-y-4">
            <div>
                <label className="block text-gray-600 mb-1" htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-gray-600 mb-1" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-gray-600 mb-1" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
            Register
            </button>
        </div>
    </div>

  )
}
export default Register;