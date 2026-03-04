const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  // මූලික විස්තර
  barcode: { type: String, required: true, unique: true },
  institution: { type: String, required: true },
  institutionFileNo: { type: String },
  
  // Dropdown values
  recordType: {
    type: String,
    enum: ['Court Records', 'Land Registry', 'Vital Records', 'Administrative Files', 'Historical Documents', 'Photographs', 'Book', 'Other']
  },
  materialType: {
    type: String,
    enum: ['File', 'Paper Documents', 'Bound Volumes', 'Photographs', 'Maps', 'Other']
  },
  
  location: { type: String }, // e.g., Freezer Unit 1
  assignedConservator: { type: String },
  
  priorityLevel: {
    type: String,
    enum: ['Critical/Urgent', 'High', 'Medium', 'Low']
  },
  contaminationLevel: {
    type: String,
    enum: ['Sewage-contaminated', 'Mud-contaminated', 'Clean water only', 'Mould-damaged', 'Unknown']
  },
  
  // Radiation තොරතුරු
  radiationStatus: {
    type: String,
    enum: ['Not Required', 'Awaiting Radiation', 'Radiation Completed', 'Not Suitable for Radiation', 'Awaiting Assessment'],
    default: 'Awaiting Assessment'
  },
  radiationTreatmentDate: { type: Date },
  radiationDosage: { type: String },

  // දින වකවානු
  dateReceivedAtArchives: { type: Date },
  startDateOfTreatment: { type: Date },
  dateCompleted: { type: Date },
  dateOfReturn: { type: Date },
  dateOfArchiving: { type: Date },

  // තත්ත්වය සහ පියවර (Preservation State)
  currentCondition: {
    type: String,
    enum: ['Wet (soaking)', 'Damp/Partially wet', 'Frozen', 'Dry but mould-affected', 'Dry and stable', 'Contaminated (sewage/mud)']
  },
  preservationState: {
    type: String,
    enum: [
      'In freezer storage', 'Awaiting treatment (In Lab)', 'Assessment for radiation treatment',
      'Sent for radiation sterilization', 'Post-radiation inspection', 'Defreezing progress',
      'Washing/Cleaning in progress', 'Vacuum packing in progress', 'Air Drying in progress',
      'Interleaving in progress', 'Flattening/Pressing', 'Rehousing/Packaging',
      'Quality control check', 'Treatment completed', 'Returned to institution', 'Transferred to National Archives'
    ]
  },

  notes: { type: String },
  
  // පින්තූර සඳහා (URLs)
  photoBefore: { type: String },
  photoAfter: { type: String }

}, { timestamps: true }); // මෙයින් created_at සහ updated_at ඉබේම හැදේ (Chain of Custody සඳහා වැදගත්)

module.exports = mongoose.model('Item', ItemSchema);