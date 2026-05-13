// ============================================================
//  FILE: src/components/AddNoteForm.jsx
//  PURPOSE: Form to create a new note on the dashboard
//  HOW IT WORKS: Has its own local state for title+content
//                Calls onAdd(newNote) prop when submitted
// ============================================================

import { useState } from "react";

export default function AddNoteForm({ onAdd, isAdding }) {
  // Local state — only this component needs these values
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit() {
    if (!title.trim()) return; // Don't submit if title is empty
    onAdd({ title, content }); // Send data to parent (Dashboard)
    setTitle("");              // Clear form after submit
    setContent("");
  }

  return (
    <div className="add-note-form">
      <div className="form-header">
        <span className="form-icon">+</span>
        <h2 className="form-title">New Note</h2>
      </div>

      <input
        className="note-input"
        type="text"
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="note-textarea"
        placeholder="Write your thoughts here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />

      <button
        className="add-btn"
        onClick={handleSubmit}
        disabled={isAdding || !title.trim()}
      >
        {isAdding ? (
          <span className="btn-loading">Creating...</span>
        ) : (
          <>
            <span>Create Note</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
