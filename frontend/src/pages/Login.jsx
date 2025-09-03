import {useState,useContext} from 'react';
import axios from '../api/axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
export default function Login(){
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const {login}=useContext(AuthContext);
    const navigate=useNavigate();
    const handleLogin=async ()=>{
        try{
            const res=await axios.post('/auth/login',{email,password})
            login(res.data);
            try{
                navigate('/')
            } catch(error){
                console.log('navigation failed')
            }
        }
        catch(eror){
            alert(error.response?.data?.msg || 'Login Failed')
        }
    }
    return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <div className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-gray-600 mb-1">Email</label>
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
                <label htmlFor="password" className="block text-gray-600 mb-1">Password</label>
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
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
            Login
            </button>
        </div>
    </div>

    )
}