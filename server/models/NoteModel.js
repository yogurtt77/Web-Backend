const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now }
});

const NoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, index: true },
    content: String,
    comments: [CommentSchema]
}, { timestamps: true });


NoteSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model('Note', NoteSchema);
