const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. User Register (මුලින්ම එක් පරිශීලකයෙකු සෑදීමට)
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword
        });
        await newUser.save();
        res.json("User registered!");
    } catch (err) { res.status(500).json(err); }
});

// 2. Login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json("User not found!");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json("Invalid password!");

    const token = jwt.sign({ id: user._id }, "SECRET_KEY_123"); // ඔයාට කැමති රහස් කේතයක් දෙන්න
    res.json({ token, username: user.username });
});

module.exports = router;