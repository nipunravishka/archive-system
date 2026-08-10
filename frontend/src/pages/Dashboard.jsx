import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useReactToPrint } from 'react-to-print';
import { RecordReport } from '../components/RecordReport'; // Components ෆෝල්ඩරයේ ඇති RecordReport එක

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null); // Print සඳහා තෝරාගත් Record එක
  
  const printRef = useRef();
  const navigate = useNavigate();

  // Local Storage එකෙන් දත්ත ලබා ගැනීම
  const userName = localStorage.getItem('userName') || "User";
  const userRole = localStorage.getItem('role') || "staff";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/items/all");
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  // --- Print Handler Setup ---
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedRecord ? `Report_${selectedRecord.barcode}` : 'Archive_Report',
  });

  const printSingleRecord = (record) => {
    setSelectedRecord(record);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // --- Chart Data Processing ---

  // 1. Priority Data
  const priorityData = [
    { name: 'Critical', value: items.filter(i => i.priorityLevel?.toLowerCase() === 'critical/urgent').length, color: '#f53636' },
    { name: 'High', value: items.filter(i => i.priorityLevel?.toLowerCase() === 'high').length, color: '#f06d0f' },
    { name: 'Medium', value: items.filter(i => i.priorityLevel?.toLowerCase() === 'medium').length, color: '#3b82f6' },
    { name: 'Low', value: items.filter(i => i.priorityLevel?.toLowerCase() === 'low').length, color: '#eef134' },
  ].filter(d => d.value > 0);

  // Current Condition අනුව දත්ත ගණනය කිරීම
  const conditionData = [
    { 
      name: 'Wet', 
      value: items.filter(i => i.currentCondition === 'Wet (soaking)').length, 
      color: '#1b69e7' // Blue
    },
    { 
      name: 'Damp', 
      value: items.filter(i => i.currentCondition === 'Damp/Partially wet').length, 
      color: '#e678d9' // Light purple
    },
    { 
      name: 'Frozen', 
      value: items.filter(i => i.currentCondition === 'Frozen').length, 
      color: '#01ebf3' // Light blue
    },
    { 
      name: 'Mould', 
      value: items.filter(i => i.currentCondition === 'Dry but mould-affected').length, 
      color: '#f59e0b' // Amber/Orange
    },
    { 
      name: 'Stable', 
      value: items.filter(i => i.currentCondition === 'Dry and stable').length, 
      color: '#10b981' // Emerald Green
    },
    { 
      name: 'Contaminated', 
      value: items.filter(i => i.currentCondition === 'Contaminated (sewage/mud)').length, 
      color: '#92400e' // Brown
    },
  ].filter(d => d.value > 0);

  // Logout Function
  const handleLogout = () => {
    if (window.confirm("ඔබට පද්ධතියෙන් ඉවත් වීමට අවශ්‍යද?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('role');
      navigate('/login', { replace: true });
    }
  };

  const handleDelete = async (id, barcode) => {
    const confirmDelete = window.confirm(`ඔබට විශ්වාසද ${barcode} අංකය සහිත ලේඛනය මැකීමට අවශ්‍ය බව?`);
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/items/delete/${id}`);
        alert("සාර්ථකව මකා දැමුවා!");
        fetchItems(); 
      } catch (error) {
        console.error("Delete Error:", error);
        alert("මකා දැමීමේදී දෝෂයක් සිදු විය.");
      }
    }
  };

  const exportToExcel = () => {
    if (filteredItems.length === 0) {
      alert("අපනයනය කිරීමට දත්ත නොමැත!");
      return;
    }

    const excelData = filteredItems.map(item => ({
      "Barcode": item.barcode,
      "Institution": item.institution,
      "File No": item.institutionFileNo || "N/A",
      "Record Type": item.recordType,
      "Material Type": item.materialType,
      "Priority": item.priorityLevel,
      "Current Condition": item.currentCondition,
      "Preservation State": item.preservationState,
      "Location": item.location || "N/A",
      "Received Date": item.dateReceivedAtArchives ? new Date(item.dateReceivedAtArchives).toLocaleDateString() : "N/A"
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Archive Records");
    XLSX.writeFile(workbook, `National_Archives_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredItems = items.filter(item => 
    item.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.institution?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 text-left font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6 bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-200 uppercase">
              {userName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">Archive Management</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  {userName} — <span className={userRole === 'admin' ? "text-purple-600" : "text-blue-600"}>{userRole} Mode</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <div className="relative hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-40 xl:w-56 shadow-inner text-xs font-medium"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              onClick={exportToExcel}
              className="bg-white hover:bg-slate-50 text-emerald-600 border border-emerald-100 font-bold py-3 px-5 rounded-2xl shadow-sm transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>

            <Link to="/register-item" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2">
              <span className="text-xl leading-none">+</span> New Record
            </Link>

            {userRole === 'admin' && (
              <Link to="/staff" className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.732 4c-.76-1.01-1.93-2-3.732-2s-2.972.99-3.732 2m9.732 11c1.13 0 2.02.9 2.02 2.02v1.02H11v-1.02c0-1.12.89-2.02 2.02-2.02h.712z" />
                </svg>
                Manage Staff
              </Link>
            )}

            <button 
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-2xl transition-all border border-red-100 group shadow-sm"
              title="Sign Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dashboard Table Container */}
        <div className="bg-white shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden border border-slate-50 mb-16">
          {loading ? (
            <div className="p-32 text-center">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-7 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Barcode ID</th>
                    <th className="p-7 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Origin Institution</th>
                    <th className="p-7 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="p-7 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr key={item._id} className="hover:bg-blue-50/30 transition-all group">
                        <td className="p-7 font-black text-blue-600 tracking-tight">{item.barcode}</td>
                        <td className="p-7">
                          <p className="font-bold text-slate-700 text-base">{item.institution}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Archive Entry</p>
                        </td>
                        <td className="p-7">
                          <span className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-sm ${
                            item.priorityLevel === 'Critical/Urgent' ? 'text-white bg-gradient-to-r from-red-600 to-rose-500' : 
                            item.priorityLevel === 'High' ? 'text-orange-700 bg-orange-100' : 'text-slate-500 bg-slate-100'
                          }`}>
                            {item.priorityLevel}
                          </span>
                        </td>
                        <td className="p-7 text-center">
                          <div className="flex justify-center gap-3">
                            <button 
                                onClick={() => navigate(`/view/${item._id}`)} 
                                className="bg-slate-900 text-white hover:bg-blue-600 p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 transition-all shadow-md"
                            >
                                View
                            </button>
                            
                            {/* 📄 Individual Report Button */}
                            <button 
                                onClick={() => printSingleRecord(item)} 
                                className="bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 transition-all"
                            >
                                Report
                            </button>

                            <button 
                                onClick={() => navigate(`/edit/${item._id}`)} 
                                className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 transition-all"
                            >
                                Edit
                            </button>
                            
                            {userRole === 'admin' && (
                              <button 
                                onClick={() => handleDelete(item._id, item.barcode)} 
                                className="bg-red-50 text-red-500 hover:bg-red-600 hover:text-white p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 transition-all"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-32 text-center text-slate-300 font-bold italic tracking-wide">No matching records found in the archive.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Priority Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
            <h3 className="text-slate-500 font-black uppercase text-xs tracking-widest mb-6">Distribution by Priority</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priorityData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Condition Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
            <h3 className="text-slate-500 font-black uppercase text-xs tracking-widest mb-6">Current Condition Analysis</h3>
            <div className="h-64 w-full">
              {conditionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={conditionData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {conditionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-300 italic text-sm">Data mapping pending...</div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden Printable Report View */}
        <div className="hidden">
          <RecordReport ref={printRef} record={selectedRecord} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;