const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// User Model එක Import කිරීම (Admin සෑදීමට මෙය අවශ්‍ය වේ)
const User = require('./models/User'); 

const app = express();

// Middleware
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// --- Admin Auto-Creation Function ---
const createAdmin = async () => {
  try {
    // දැනටමත් මෙම Email එකෙන් අයෙක් සිටීදැයි පරීක්ෂා කරයි
    const adminExists = await User.findOne({ email: 'admin@archives.gov.lk' });
    
    if (!adminExists) {
      const admin = new User({
        name: 'Super Admin',
        email: 'admin@archives.gov.lk',
        password: 'admin123', // මෙය User.js හි ඇති pre-save hook එකෙන් encrypt වේ
        role: 'admin'
      });
      
      await admin.save();
      console.log("✅ Default Admin Created: admin@archives.gov.lk / admin123");
    } else {
      console.log("ℹ️ Admin already exists. No new admin created.");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
};

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB database connection established successfully");
    // Database එක connect වූ පසු Admin සෑදීමේ function එක ක්‍රියාත්මක කරයි
    createAdmin(); 
  })
  .catch(err => console.log("Database connection error: ", err));

// Routes
const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);
app.use('/api/auth', require('./routes/auth')); // මෙහි 'authRoutes' ලෙස ඇත්නම් එය නිවැරදිව පරීක්ෂා කරන්න

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});