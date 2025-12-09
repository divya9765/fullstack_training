const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// CREATE
router.post("/create", async (req, res) => {
    const { task } = req.body;
    if (!task) return res.status(400).send("Task is required");

    try {
        const todo = new Todo({ task });
        await todo.save();
        res.status(201).send(todo);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating task");
    }
});

// READ
router.get("/read", async (req, res) => {
    try {
        const todos = await Todo.find({});
        res.status(200).json(todos);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error reading tasks");
    }
});

// UPDATE
router.put("/update/:id", async (req, res) => {
    const { task, completed } = req.body;
    const id = req.params.id;

    try {
        const updated = await Todo.findByIdAndUpdate(id, { task, completed }, { new: true });
        if (!updated) return res.status(404).send("Task not found");
        res.status(200).send(updated);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating task");
    }
});

// DELETE
router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const deleted = await Todo.findByIdAndDelete(id);
        if (!deleted) return res.status(404).send("Task not found");
        res.status(200).send("Task deleted successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting task");
    }
});

module.exports = router;
