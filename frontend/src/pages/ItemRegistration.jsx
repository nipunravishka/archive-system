import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://archive-backend-three.vercel.app/api/items";

const ItemRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    barcode: '', institution: '', institutionFileNo: '',
    recordType: 'Court Records', materialType: 'File',
    location: '', assignedConservator: '',
    priorityLevel: 'Medium', contaminationLevel: 'Unknown',
    radiationStatus: 'Awaiting Assessment', radiationTreatmentDate: '', radiationDosage: '',
    notes: '', dateReceivedAtArchives: '', startDateOfTreatment: '',
    dateCompleted: '', dateOfReturn: '', dateOfArchiving: '',
    currentCondition: 'Dry and stable', preservationState: 'In freezer storage'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/add`, formData);
      if (response.status === 201 || response.status === 200) {
        alert("සාර්ථකව ලියාපදිංචි කළා!");
        navigate('/');
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "දෝෂයක් සිදු විය.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 text-left">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8">
          <h2 className="text-3xl font-extrabold text-white">Advanced Record Registration</h2>
          <p className="text-blue-100 mt-1">National Archives Conservation Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          
          {/* SECTION 1: Basic Identification */}
          <section>
            <h3 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">1. Identification & Origin</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Item No (Barcode) *</label>
                <input name="barcode" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="KDC-001" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Institution / Source *</label>
                <input name="institution" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Kandy District Court" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Institution File No</label>
                <input name="institutionFileNo" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ref-123" />
              </div>
            </div>
          </section>

          {/* SECTION 2: Record Details */}
          <section>
            <h3 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">2. Record Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Record Type</label>
                <select name="recordType" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                  {['Court Records', 'Land Registry', 'Vital Records', 'Administrative Files', 'Historical Documents', 'Photographs', 'Book', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Material Type</label>
                <select name="materialType" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                  {['File', 'Paper Documents', 'Bound Volumes', 'Photographs', 'Maps', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Priority Level</label>
                <select name="priorityLevel" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none font-bold text-orange-600">
                  {['Critical/Urgent', 'High', 'Medium', 'Low'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 3: Condition & Status */}
          <section className="bg-blue-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-blue-800 mb-4">3. Condition & Preservation Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Current Condition</label>
                <select name="currentCondition" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                  {['Wet (soaking)', 'Damp/Partially wet', 'Frozen', 'Dry but mould-affected', 'Dry and stable', 'Contaminated (sewage/mud)'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Preservation State</label>
                <select name="preservationState" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none bg-white font-semibold text-blue-700">
                  {['In freezer storage', 'Awaiting treatment (In Lab)', 'Assessment for radiation treatment', 'Sent for radiation sterilization', 'Post-radiation inspection', 'Defreezing progress', 'Washing/Cleaning in progress', 'Vacuum packing in progress', 'Air Drying in progress', 'Interleaving in progress', 'Flattening/Pressing', 'Rehousing/Packaging', 'Quality control check', 'Treatment completed', 'Returned to institution', 'Transferred to National Archives'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Contamination Level</label>
                <select name="contaminationLevel" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                  {['Sewage-contaminated', 'Mud-contaminated', 'Clean water only', 'Mould-damaged', 'Unknown'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Physical Location</label>
                <input name="location" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none bg-white" placeholder="e.g. Freezer Unit 1" />
              </div>
            </div>
          </section>

          {/* SECTION 4: Dates & Tracking */}
          <section>
            <h3 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">4. Tracking & Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <label className="font-semibold">Date Received</label>
                <input type="date" name="dateReceivedAtArchives" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Start of Treatment</label>
                <input type="date" name="startDateOfTreatment" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Date Completed</label>
                <input type="date" name="dateCompleted" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
            </div>
          </section>

          {/* SECTION 5: Radiation & Staff */}
          <section>
            <h3 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">5. Radiation & Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Radiation Status</label>
                <select name="radiationStatus" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                  {['Not Required', 'Awaiting Radiation', 'Radiation Completed', 'Not Suitable for Radiation', 'Awaiting Assessment'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Assigned Conservator</label>
                <input name="assignedConservator" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Staff Name" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Notes / Remarks</label>
                <textarea name="notes" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none" rows="1" placeholder="Special handling..."></textarea>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t">
            <button type="button" onClick={() => navigate('/')} className="px-8 py-3 text-gray-500 font-bold hover:text-gray-700 transition">Cancel</button>
            <button type="submit" className="px-12 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transform hover:-translate-y-1 transition-all active:scale-95">SAVE OFFICIAL RECORD</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ItemRegistration;