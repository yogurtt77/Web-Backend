const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createNote, getNotes, updateNote, deleteNote } = require("../controllers/noteController");
const Note = require("../models/noteModel"); // Add this line


const router = express.Router();

router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getNotes);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);

router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const results = await Note.find({ $text: { $search: query } });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/top-users', async (req, res) => {
    try {
        const topUsers = await Note.aggregate([
            { $group: { _id: "$userId", noteCount: { $sum: 1 } } },
            { $sort: { noteCount: -1 } },
            { $limit: 5 }
        ]);
        res.json(topUsers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching top users' });
    }
});


module.exports = router;
