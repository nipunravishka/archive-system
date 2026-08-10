import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://archive-backend-three.vercel.app/api/items";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${API_URL}/all`);
        const itemToEdit = response.data.find(item => item._id === id);
        
        if (itemToEdit) {
          // HTML Date Input එකට ගැළපෙන සේ දින Format කිරීම (YYYY-MM-DD)
          const formattedData = { ...itemToEdit };
          const dateFields = [
            'dateReceivedAtArchives', 'startDateOfTreatment', 'dateCompleted', 
            'dateOfReturn', 'dateOfArchiving', 'radiationTreatmentDate'
          ];
          
          dateFields.forEach(field => {
            if (formattedData[field]) {
              formattedData[field] = new Date(formattedData[field]).toISOString().split('T')[0];
            }
          });
          setFormData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/update/${id}`, formData);
      alert("දත්ත සාර්ථකව යාවත්කාලීන කළා!");
      navigate('/');
    } catch (error) {
      console.error("Update Error:", error);
      alert("යාවත්කාලීන කිරීමේදී දෝෂයක් සිදු විය.");
    }
  };

  if (!formData) return <div className="p-20 text-center font-bold text-gray-500">Loading Data...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 text-left">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-green-100">
        
        {/* Header - Green Theme for Edit */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-500 p-8">
          <h2 className="text-3xl font-extrabold text-white">Edit Record: {formData.barcode}</h2>
          <p className="text-green-50 mt-1">Update archival conservation details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          
          {/* SECTION 1: Identification & Origin */}
          <section>
            <h3 className="text-lg font-bold text-green-700 mb-4 border-b pb-2">1. Identification & Origin</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Item No (Barcode)</label>
                <input name="barcode" value={formData.barcode} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Institution / Source</label>
                <input name="institution" value={formData.institution} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Institution File No</label>
                <input name="institutionFileNo" value={formData.institutionFileNo || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
            </div>
          </section>

          {/* SECTION 2: Record Specifications */}
          <section>
            <h3 className="text-lg font-bold text-green-700 mb-4 border-b pb-2">2. Record Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Record Type</label>
                <select name="recordType" value={formData.recordType} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                  {['Court Records', 'Land Registry', 'Vital Records', 'Administrative Files', 'Historical Documents', 'Photographs', 'Book', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Material Type</label>
                <select name="materialType" value={formData.materialType} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                  {['File', 'Paper Documents', 'Bound Volumes', 'Photographs', 'Maps', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Priority Level</label>
                <select name="priorityLevel" value={formData.priorityLevel} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none font-bold text-orange-600">
                  {['Critical/Urgent', 'High', 'Medium', 'Low'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 3: Condition & Status */}
          <section className="bg-green-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-green-800 mb-4">3. Condition & Preservation Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Current Condition</label>
                <select name="currentCondition" value={formData.currentCondition} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                  {['Wet (soaking)', 'Damp/Partially wet', 'Frozen', 'Dry but mould-affected', 'Dry and stable', 'Contaminated (sewage/mud)'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Preservation State</label>
                <select name="preservationState" value={formData.preservationState} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none bg-white font-semibold text-blue-700">
                  {['In freezer storage', 'Awaiting treatment (In Lab)', 'Assessment for radiation treatment', 'Sent for radiation sterilization', 'Post-radiation inspection', 'Defreezing progress', 'Washing/Cleaning in progress', 'Vacuum packing in progress', 'Air Drying in progress', 'Interleaving in progress', 'Flattening/Pressing', 'Rehousing/Packaging', 'Quality control check', 'Treatment completed', 'Returned to institution', 'Transferred to National Archives'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Contamination Level</label>
                <select name="contaminationLevel" value={formData.contaminationLevel} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                  {['Sewage-contaminated', 'Mud-contaminated', 'Clean water only', 'Mould-damaged', 'Unknown'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Physical Location</label>
                <input name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none bg-white" />
              </div>
            </div>
          </section>

          {/* SECTION 4: Dates & Tracking */}
          <section>
            <h3 className="text-lg font-bold text-green-700 mb-4 border-b pb-2">4. Tracking & Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <label className="font-semibold">Date Received</label>
                <input type="date" name="dateReceivedAtArchives" value={formData.dateReceivedAtArchives || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Start of Treatment</label>
                <input type="date" name="startDateOfTreatment" value={formData.startDateOfTreatment || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Date Completed</label>
                <input type="date" name="dateCompleted" value={formData.dateCompleted || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
            </div>
          </section>

          {/* SECTION 5: Radiation & Assignment */}
          <section>
            <h3 className="text-lg font-bold text-green-700 mb-4 border-b pb-2">5. Radiation & Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Radiation Status</label>
                <select name="radiationStatus" value={formData.radiationStatus} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                  {['Not Required', 'Awaiting Radiation', 'Radiation Completed', 'Not Suitable for Radiation', 'Awaiting Assessment'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Assigned Conservator</label>
                <input name="assignedConservator" value={formData.assignedConservator || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Notes / Remarks</label>
                <textarea name="notes" value={formData.notes || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none" rows="1"></textarea>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t">
            <button type="button" onClick={() => navigate('/')} className="px-8 py-3 text-gray-500 font-bold hover:text-gray-700 transition">Cancel</button>
            <button type="submit" className="px-12 py-3 bg-green-600 text-white font-black rounded-2xl shadow-xl hover:bg-green-700 transform hover:-translate-y-1 transition-all active:scale-95">UPDATE OFFICIAL RECORD</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditItem;