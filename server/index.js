const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. cors import කිරීම
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // 2. සියලුම ඉල්ලීම් සඳහා cors අවසර දීම
app.use(express.json()); // 3. Frontend එකෙන් එවන JSON දත්ත කියවීමට

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB database connection established successfully"))
  .catch(err => console.log("Database connection error: ", err));

// Routes
const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes); // සියලුම item සම්බන්ධ වැඩ සඳහා
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});