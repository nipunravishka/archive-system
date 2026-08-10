const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Admin ට පමණක් Users ලා ඇඩ් කළ හැකි Route එක
router.post('/add-user', async (req, res) => {
    // සැබෑ පද්ධතියක මෙතැනට Admin ද කියා බලන Middleware එකක් දැමිය යුතුයි
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ msg: "User created successfully" });
    } catch (err) {
        res.status(400).json({ msg: "Email already exists" });
    }
});

module.exports = router;