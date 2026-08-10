import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://archive-backend-three.vercel.app/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('userName', res.data.user.name);
      
      alert(`Welcome back, ${res.data.user.name}!`);
      navigate('/'); // Dashboard එකට යවයි
    } catch (err) {
      alert("Login failed! Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Login</h2>
        <p className="text-slate-500 mb-8 font-medium">Archive Management System</p>
        
        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 border rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: abc@archives.gov.lk"
              onChange={(e) => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min 6 characters"
              onChange={(e) => setPassword(e.target.value)} required 
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;