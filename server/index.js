const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User'); 

const app = express();

// Middleware
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// --- Cached Database Connection Function (Vercel සඳහා) ---
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // Requests buffering වීම වලක්වයි
      serverSelectionTimeoutMS: 5000
    });
    
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connected successfully");

    // Connect වූ පසු Admin සෑදීම
    await createAdmin();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

// Request එකක් එන සෑම මොහොතකම DB Connection එක තහවුරු කරගන්නා Middleware එක
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed!" });
  }
});

// --- Admin Auto-Creation Function ---
const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@archives.gov.lk' });
    
    if (!adminExists) {
      const admin = new User({
        name: 'Super Admin',
        email: 'admin@archives.gov.lk',
        password: 'admin123',
        role: 'admin'
      });
      
      await admin.save();
      console.log("✅ Default Admin Created: admin@archives.gov.lk / admin123");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
};

// Routes
const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);
app.use('/api/auth', require('./routes/auth'));

// Local environment එකේදී පමණක් listen කිරීමට
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Vercel සඳහා Export කිරීම
module.exports = app;