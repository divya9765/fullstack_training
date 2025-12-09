const express = require('express');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();
require('./db');

// Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true }
});

// Model
const User = mongoose.model('User', userSchema);

// Save a new user and show success message
async function createUser() {
    try {
        const newUser = new User({
            username: 'divya',
            email: 'divya@gmail.com',
            age: 21
        });

        await newUser.save();
        console.log("✅ User saved successfully");
    } catch (error) {
        console.log("❌ Error saving user:", error.message);
    }
}

createUser();

// Routes
app.get('/', (req, res) => {
    res.send("Hello All");
});

// listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
