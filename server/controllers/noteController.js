const Note = require("../models/noteModel");
const User = require("../models/userModel");

//Create a Note (Linked to Logged-in User)
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validate input
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        // Create note with user reference
        const newNote = await Note.create({
            title,
            content,
            userId: req.user.id
        });

        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ message: "Error creating note", error: err.message });
    }
};

// ✅ Get All Notes of Logged-in User
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).populate("userId", "username");
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notes", error: err.message });
    }
};

// ✅ Update a Note (Only if the User Owns It)
exports.updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validate input
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const note = await Note.findById(req.params.id);

        // Check if note exists
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        // Ensure user owns the note
        if (note.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to edit this note" });
        }

        // Update the note
        note.title = title;
        note.content = content;
        note.updatedAt = new Date(); // updatedAt
        await note.save();

        res.json(note);
    } catch (err) {
        res.status(500).json({ message: "Error updating note", error: err.message });
    }
};

// ✅ Delete a Note (Only if the User Owns It)
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        // Check if note exists
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        // Ensure user owns the note
        if (note.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this note" });
        }

        await note.deleteOne();
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting note", error: err.message });
    }
};
