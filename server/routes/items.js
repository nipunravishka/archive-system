const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// 1. අලුත් අයිතමයක් ඇතුළත් කිරීම (Create a new record)
router.post('/add', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 2. සියලුම අයිතම ලබා ගැනීම (Get all records)
router.get('/all', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 }); // අලුත්ම ඒවා මුලට එන ලෙස
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. නිශ්චිත අයිතමයක් Barcode එකෙන් සෙවීම (Search by Barcode)
router.get('/search/:barcode', async (req, res) => {
    try {
        const item = await Item.findOne({ barcode: req.params.barcode });
        if (!item) return res.status(404).json({ message: "අයිතමය හමු නොවීය" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// අයිතමයක් යාවත්කාලීන කිරීම (Update Item)
router.put('/update/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;