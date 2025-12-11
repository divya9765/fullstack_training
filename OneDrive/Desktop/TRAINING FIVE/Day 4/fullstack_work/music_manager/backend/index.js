require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cors = require("cors");

//--------MONGODB CONNECTION--------//
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

//--------USER SCHEMA--------//
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

//--------MUSIC SCHEMA--------//
const musicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    year: { type: Number, required: true }
});
const Music = mongoose.model("Music", musicSchema);

//--------EXPRESS APP--------//
const app = express();
app.use(cors());
app.use(express.json());

//--------REGISTER--------//
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

//--------LOGIN--------//
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

//--------JWT VERIFY MIDDLEWARE--------//
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        req.userId = decoded.userId;
        next();
    });
};

//--------MUSIC ROUTES--------//
app.get("/api/music", verifyToken, async (req, res) => {
    try {
        const musicList = await Music.find();
        res.status(200).json(musicList);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/music", verifyToken, async (req, res) => {
    try {
        const { name, artist, album, year } = req.body;

        const newMusic = new Music({ name, artist, album, year });
        await newMusic.save();

        res.status(201).json(newMusic);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.delete("/api/music/:id", verifyToken, async (req, res) => {
    try {
        await Music.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Music deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

//--------START SERVER--------//
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
