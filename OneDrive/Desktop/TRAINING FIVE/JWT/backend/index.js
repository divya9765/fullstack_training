require("dotenv").config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');

// -------------------- MONGODB CONNECTION -------------------- //
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB Error:", err));

// -------------------- USER SCHEMA --------------------------- //
const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }
});

const User = mongoose.model('User', UserSchema);

// -------------------- FOOD SCHEMA --------------------------- //
const foodSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    daysSinceIAte: { 
        type: Number, 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Food = mongoose.model('Food', foodSchema);

// -------------------- EXPRESS SETUP -------------------------- //
const app = express();
app.use(cors());
app.use(express.json());

// -------------------- REGISTER ------------------------------- //
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, password: hashedPassword });
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// -------------------- LOGIN ---------------------------------- //
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).send("Invalid credentials");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).send("Invalid credentials");

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// -------------------- JWT VERIFY MIDDLEWARE ------------------- //
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send("No token provided");

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send("Invalid token");
        req.userId = decoded.userId;
        next();
    });
};

// -------------------- ADD FOOD -------------------------------- //
app.post('/api/food', verifyToken, async (req, res) => {
    try {
        const { name, daysSinceIAte } = req.body;

        const food = new Food({
            name,
            daysSinceIAte,
            user: req.userId
        });

        await food.save();

        res.status(201).send("Food entry created");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// -------------------- GET FOOD -------------------------------- //
app.get('/api/food', verifyToken, async (req, res) => {
    try {
        const entries = await Food.find({ user: req.userId });
        res.json(entries);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// -------------------- DELETE FOOD ------------------------------ //
app.delete('/api/food/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Food.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!deleted) return res.status(404).send("Food entry not found");

        res.send("Food entry deleted");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// -------------------- UPDATE FOOD ------------------------------ //
app.put('/api/food/:id', verifyToken, async (req, res) => {
    try {
        const { daysSinceIAte } = req.body;

        const updated = await Food.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { daysSinceIAte },
            { new: true }
        );

        if (!updated) return res.status(404).send("Food entry not found");

        res.json(updated);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// -------------------- SERVER START ----------------------------- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
