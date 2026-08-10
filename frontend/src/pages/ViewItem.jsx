import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ViewItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/items/all`);
        const foundItem = response.data.find(i => i._id === id);
        setItem(foundItem);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };
    fetchItem();
  }, [id]);

  if (!item) return <div className="p-20 text-center font-bold">Loading Record...</div>;

  // දත්ත පෙන්වන කුඩා කොටසක් (Helper Component)
  const InfoBox = ({ label, value, highlight = false }) => (
    <div className="border-b border-gray-100 py-3">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-medium ${highlight ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
        {value || "Not Specified"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 text-left">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        
        {/* Top Header Section */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
          <div>
            <span className="bg-blue-600 text-[10px] font-black px-2 py-1 rounded mb-2 inline-block uppercase">Official Archive Record</span>
            <h2 className="text-4xl font-black">{item.barcode}</h2>
            <p className="text-slate-400 mt-1">{item.institution}</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-xl text-sm font-bold transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 border-l-4 border-blue-600 pl-3 mb-6">General Information</h3>
            <InfoBox label="Institution File No" value={item.institutionFileNo} />
            <InfoBox label="Record Type" value={item.recordType} />
            <InfoBox label="Material Type" value={item.materialType} />
            <InfoBox label="Priority Level" value={item.priorityLevel} highlight />
            <InfoBox label="Current Condition" value={item.currentCondition} />
            <InfoBox label="Assigned Conservator" value={item.assignedConservator} />
          </div>

          {/* Right Column: Status & Tracking */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 border-l-4 border-orange-500 pl-3 mb-6">Status & Timeline</h3>
            <div className="bg-orange-50 p-4 rounded-2xl mb-6">
              <p className="text-xs font-bold text-orange-600 uppercase">Current State</p>
              <p className="text-lg font-black text-orange-900">{item.preservationState}</p>
            </div>
            
            <InfoBox label="Physical Location" value={item.location} />
            <InfoBox label="Date Received" value={item.dateReceivedAtArchives ? new Date(item.dateReceivedAtArchives).toLocaleDateString() : '-'} />
            <InfoBox label="Treatment Started" value={item.startDateOfTreatment ? new Date(item.startDateOfTreatment).toLocaleDateString() : '-'} />
            <InfoBox label="Treatment Completed" value={item.dateCompleted ? new Date(item.dateCompleted).toLocaleDateString() : '-'} />
            <InfoBox label="Radiation Status" value={item.radiationStatus} />
          </div>

        </div>

        {/* Footer Notes */}
        <div className="bg-slate-50 p-8 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Notes & Remarks</p>
          <p className="text-sm text-slate-600 italic">
            {item.notes || "No special remarks recorded for this item."}
          </p>
        </div>

        <div className="p-6 text-center">
            <button 
              onClick={() => navigate(`/edit/${item._id}`)}
              className="text-blue-600 font-bold text-sm hover:underline"
            >
              Click here to modify this record
            </button>
        </div>
      </div>
    </div>
  );
};

export default ViewItem;