const noteModel = require("../models/note.models");

async function createNote(req, res) {
    const { title, content } = req.body;

    // Validation
    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    const note = await noteModel.create({
        title,
        content,
        user: req.user.id   // ← Middleware ne req.user set kiya tha
    });

    res.status(201).json(note);
}

async function getNotes(req, res) {

    const notes = await noteModel.find({ user: req.user.id })
                                 .sort({ createdAt: -1 }); 

    res.status(200).json(notes);
}


async function deleteNote(req, res) {
    const { id } = req.params; 

    const note = await noteModel.findById(id);
    if (!note) {
        return res.status(404).json({
            message: "Note not found"
        });
    }


    if (note.user.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You can only delete your own notes"
        });
    }

    await noteModel.findByIdAndDelete(id);

    res.status(200).json({
        message: "Note deleted successfully"
    });
}


async function updateNote(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await noteModel.findById(id);

    if (!note) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You can only edit your own notes"
        });
    }

    const updatedNote = await noteModel.findByIdAndUpdate(
        id,
        { title, content },
        { new: true } 
    );

    res.status(200).json(updatedNote);
}

module.exports = { createNote, getNotes, deleteNote ,updateNote};