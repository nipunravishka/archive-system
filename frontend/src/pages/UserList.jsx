import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://archive-backend-three.vercel.app/api/auth/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      setError("සේවක විස්තර ලබා ගැනීමට නොහැකි විය.");
      setLoading(false);
    }
  };

  const deleteUser = async (id, name) => {
    if (window.confirm(`${name || 'මෙම සේවකයාව'} පද්ධතියෙන් ඉවත් කිරීමට ඔබට සහතිකද?`)) {
      try {
        await axios.delete(`https://archive-backend-three.vercel.app/api/auth/user/${id}`);
        setUsers(users.filter(user => user._id !== id));
        alert("සාර්ථකව ඉවත් කළා!");
      } catch (err) {
        alert("දෝෂයක් සිදු විය.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 text-left font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Staff Management</h2>
            <p className="text-slate-500 font-medium text-lg">
               පද්ධතියේ ලියාපදිංචි මුළු සේවකයින් ගණන: <span className="text-purple-600 font-bold">{users.length}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-purple-200 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Staff
            </Link>
            <Link to="/" className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-xl font-bold animate-bounce">
            {error}
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-24 text-center">
               <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Fetching Data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="p-6 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Staff Information</th>
                    <th className="p-6 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Email Address</th>
                    <th className="p-6 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Role</th>
                    <th className="p-6 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-110 duration-300 ${
                            index % 2 === 0 ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-base">{user.name || "N/A"}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Member</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-slate-500 font-semibold">{user.email}</span>
                      </td>
                      <td className="p-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md ${
                          user.role === 'admin' 
                          ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white border border-slate-700' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        {user.role !== 'admin' ? (
                          <button 
                            onClick={() => deleteUser(user._id, user.name)}
                            className="bg-transparent text-slate-300 hover:text-red-500 p-2 rounded-xl transition-all duration-300 hover:bg-red-50"
                            title="Remove User"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-bold italic pr-2">System Restricted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;