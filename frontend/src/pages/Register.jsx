import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: 'staff' // Default ලෙස 'staff' ලෙස සකසා ඇත
  });
  
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    // Password දෙක සමාන දැයි පරීක්ෂා කිරීම
    if (formData.password !== formData.confirmPassword) {
      return setError("මුරපද දෙක එකිනෙකට නොගැලපේ. කරුණාකර නැවත පරීක්ෂා කරන්න.");
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      const res = await axios.post('http://localhost:5000/api/auth/add-user', payload);
      
      alert(res.data.msg || "Registration Successful!");
      navigate('/staff'); 
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Registration failed!";
      setError(errorMsg);
      console.error("Error details:", err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Register New Staff</h2>
        <p className="text-slate-500 text-sm mb-6 font-medium">Add a new member to the conservation system.</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-200 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" 
              placeholder="Ex: Nipun Ravishka"
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 border border-slate-200 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" 
              placeholder="name@archives.gov.lk"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>

          {/* User Role Select Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assign User Role</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-slate-700 bg-white cursor-pointer"
            >
              <option value="staff">Staff Member</option>
              <option value="conservator">Conservator</option>
              <option value="admin">System Admin</option>
            </select>
          </div>

          {/* Initial Password */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Initial Password</label>
            <input 
              type="password" 
              placeholder="Min 6 characters" 
              className="w-full p-3 border border-slate-200 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
              minLength="6"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <input 
              type="password" 
              placeholder="Repeat your password" 
              className={`w-full p-3 border rounded-xl mt-1 outline-none transition-all text-sm font-medium ${
                formData.confirmPassword && formData.password !== formData.confirmPassword 
                ? 'border-red-500 focus:ring-red-100' 
                : 'border-slate-200 focus:ring-blue-500'
              }`} 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              required 
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95"
            >
              Create Staff Account
            </button>
            <button 
              type="button"
              onClick={() => navigate('/staff')}
              className="w-full mt-2 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold py-3 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;