const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, // Email එක සැමවිටම lowercase ලෙස තබා ගනී
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'user', 'staff', 'conservator'], // 👈 අලුතින් 'staff' සහ 'conservator' එක් කළා
    default: 'user' 
  },
}, { timestamps: true });

// Password එක save කිරීමට පෙර encrypt කිරීමේ Middleware එක
UserSchema.pre('save', async function() {
  // Password එක වෙනස් වී නොමැති නම් ඉදිරියට යන්න (Skip encryption)
  if (!this.isModified('password')) return;

  try {
    // වඩාත් ආරක්ෂිතව Password එක Hash කිරීම සඳහා Salt එකක් සාදා ගනිමු
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // යම් දෝෂයක් වුවහොත් එය Mongoose වෙත ලබා දේ
    throw error;
  }
});

module.exports = mongoose.model('User', UserSchema);