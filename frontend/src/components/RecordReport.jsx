import React from 'react';

export const RecordReport = React.forwardRef(({ record }, ref) => {
  if (!record) return null;

  // Object එකේ තියෙන ඕනෑම Key එකක් සොයා ගැනීමට උපකාරී වන Helper function එකක්
  const findValueByKeys = (obj, possibleKeywords) => {
    const keys = Object.keys(obj);
    for (const keyword of possibleKeywords) {
      const foundKey = keys.find(k => k.toLowerCase().includes(keyword.toLowerCase()));
      if (foundKey && obj[foundKey]) {
        return obj[foundKey];
      }
    }
    return null;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    const parsedDate = new Date(dateValue);
    if (isNaN(parsedDate.getTime())) {
      return dateValue;
    }
    return parsedDate.toLocaleDateString('en-GB');
  };

  // Treatment Start, Complete, Received දිනයන් Dynamic ලෙස සොයා ගැනීම
  const rawTreatmentStarted = findValueByKeys(record, ['treatmentstart', 'startdate', 'treatment_start', 'started']);
  const rawTreatmentCompleted = findValueByKeys(record, ['treatmentcomplete', 'enddate', 'treatment_end', 'treatmentcompleted', 'completed', 'completion']);
  const rawDateReceived = findValueByKeys(record, ['received', 'datereceived', 'receiveddate']);

  return (
    <div ref={ref} className="p-8 bg-white text-slate-800 font-sans max-w-4xl mx-auto">
      {/* Header / Letterhead */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-center">
        <div>
          <span className="bg-blue-900 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
            Official Archive Record
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
            {record.barcode || 'N/A'}
          </h1>
          <p className="text-sm font-bold text-slate-600">{record.institution || 'N/A'}</p>
        </div>
        <div className="text-right text-xs text-slate-500 font-medium">
          <p className="font-bold text-slate-700">NATIONAL ARCHIVES DEPARTMENT</p>
          <p className="mt-1">Generated: {new Date().toLocaleDateString('en-GB')}</p>
          <p className="text-[10px] text-slate-400">Doc ID: #{record._id?.substring(0, 8)}</p>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        
        {/* Left Column - General Information */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-blue-800 uppercase tracking-widest border-b border-blue-100 pb-1">
            General Information
          </h2>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Institution File No</p>
            <p className="text-sm font-semibold text-slate-800">{record.institutionFileNo || 'N/A'}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Record Type</p>
            <p className="text-sm font-semibold text-slate-800">{record.recordType || 'N/A'}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Material Type</p>
            <p className="text-sm font-semibold text-slate-800">{record.materialType || 'N/A'}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Priority Level</p>
            <p className="text-sm font-bold text-blue-600">{record.priorityLevel || 'N/A'}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Current Condition</p>
            <p className="text-sm font-semibold text-slate-800">{record.currentCondition || 'N/A'}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Conservator</p>
            <p className="text-sm font-semibold text-slate-800">{record.assignedConservator || record.conservator || record.assignedTo || 'N/A'}</p>
          </div>
        </div>

        {/* Right Column - Status & Timeline */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-orange-800 uppercase tracking-widest border-b border-orange-100 pb-1">
            Status & Timeline
          </h2>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
            <p className="text-[10px] font-bold text-amber-700 uppercase">Current State</p>
            <p className="text-base font-black text-amber-900">{record.preservationState || record.status || 'N/A'}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Physical Location</p>
            <p className="text-sm font-semibold text-slate-800">{record.location || 'N/A'}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Date Received</p>
            <p className="text-sm font-semibold text-slate-800">{formatDate(rawDateReceived || record.dateReceivedAtArchives)}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Treatment Started</p>
            <p className="text-sm font-semibold text-slate-800">{formatDate(rawTreatmentStarted)}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Treatment Completed</p>
            <p className="text-sm font-semibold text-slate-800">{formatDate(rawTreatmentCompleted)}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Radiation Status</p>
            <p className="text-sm font-semibold text-slate-800">{record.radiationStatus || 'N/A'}</p>
          </div>
        </div>

      </div>

      {/* Notes & Remarks */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-12">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Notes & Remarks</p>
        <p className="text-xs text-slate-700 italic">
          {record.notes || record.remarks || 'No special remarks recorded for this item.'}
        </p>
      </div>

      {/* Signatures */}
      <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-12 text-center text-xs">
        <div>
          <div className="border-b border-slate-400 w-3/4 mx-auto mb-2"></div>
          <p className="font-bold text-slate-700">Prepared By (Conservator)</p>
        </div>
        <div>
          <div className="border-b border-slate-400 w-3/4 mx-auto mb-2"></div>
          <p className="font-bold text-slate-700">Authorized Signature (Admin)</p>
        </div>
      </div>
    </div>
  );
});