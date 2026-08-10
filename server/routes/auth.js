const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- 1. සේවකයින් ඇතුළත් කිරීම (REGISTER STAFF) ---
router.post('/add-user', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // සියලුම දත්ත ලැබී ඇත්දැයි බැලීම
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "කරුණාකර සියලුම විස්තර ඇතුළත් කරන්න." });
        }

        // Email එක කලින් පද්ධතියේ තිබේදැයි බැලීම
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ msg: "මෙම Email ලිපිනය සහිත පරිශීලකයෙකු දැනටමත් සිටී." });
        }

        // අලුත් පරිශීලකයා සෑදීම
        user = new User({
            name,
            email: email.toLowerCase(),
            password, // මෙය User.js හි ඇති pre-save hook එකෙන් hash වේ
            role: role || 'user'
        });

        await user.save();
        res.status(201).json({ msg: "නව සේවකයා සාර්ථකව පද්ධතියට එක් කරන ලදී!" });

    } catch (err) {
        console.error("Add User Error:", err.message);
        res.status(500).json({ msg: "Server error: " + err.message });
    }
});

// --- 2. ඇතුළු වීමේ මාර්ගය (LOGIN ROUTE) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // පරිශීලකයා සොයා ගැනීම
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ msg: "පරිශීලකයා පද්ධතියේ හමු නොවීය." });

        // මුරපදය පරීක්ෂා කිරීම
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "ඔබ ඇතුළත් කළ මුරපදය වැරදියි." });

        // JWT Token එක සෑදීම
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            "your_jwt_secret", 
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// --- 3. සියලුම පරිශීලකයින් ලබා ගැනීම (GET ALL USERS) ---
router.get('/users', async (req, res) => {
    try {
        // මුරපද (password) රහිතව දත්ත ලබා ගනී
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error("Get Users Error:", err.message);
        res.status(500).json({ msg: "සේවක ලැයිස්තුව ලබා ගැනීමට නොහැකි විය." });
    }
});

// --- 4. පරිශීලකයෙකු ඉවත් කිරීම (DELETE USER) ---
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        // Admin කෙනෙක්ව Delete කිරීම වැළැක්වීම (විකල්ප)
        if (user && user.role === 'admin') {
            return res.status(403).json({ msg: "ප්‍රධාන පරිපාලකවරයා (Admin) ඉවත් කළ නොහැක." });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "සේවකයා සාර්ථකව පද්ධතියෙන් ඉවත් කරන ලදී." });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ msg: "ඉවත් කිරීමේදී දෝෂයක් සිදු විය." });
    }
});

module.exports = router;