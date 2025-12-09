const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Food = require('./models/food');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Mongoose 7+)
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Mongo connection error:", err));

// ========================
// ROUTES
// ========================

// CREATE - Insert Food
app.post("/insert", async (req, res) => {
    const { foodName, daySinceIate } = req.body;

    const food = new Food({ foodName, daySinceIate });

    try {
        await food.save();
        res.status(201).send("Data Inserted successfully");
    } catch (err) {
        console.log(err); // DEBUG
        res.status(500).send("Error inserting food data");
    }
});

// READ - Get All Foods
app.get("/read", async (req, res) => {
    try {
        const foodData = await Food.find({});
        res.status(200).send(foodData);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error reading food items");
    }
});

// UPDATE - Update Food Name by ID
app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const { newFoodName } = req.body;

    try {
        await Food.findByIdAndUpdate(id, { foodName: newFoodName });
        res.status(200).send("Food item updated successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating food item");
    }
});

// DELETE - Delete Food by ID
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await Food.findByIdAndDelete(id);
        res.status(200).send("Food item deleted successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting food item");
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
