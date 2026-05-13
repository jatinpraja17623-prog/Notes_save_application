import { useState } from "react";
import { updateNote } from "../utils/api";

export default function NoteModal({ note, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saving, setSaving] = useState(false);

  if (!note) return null;

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateNote(note._id, { title, content });
      if (updated._id) {
        onUpdate(updated); // ← Dashboard ko updated note bhejo
        setIsEditing(false);
      }
    } catch {
      alert("Could not save note.");
    }
    setSaving(false);
  }

  function handleCancel() {
    setTitle(note.title);      // ← original content wapas
    setContent(note.content);
    setIsEditing(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-badge">
            {title?.charAt(0).toUpperCase()}
          </div>
          <div className="modal-meta">
            {isEditing ? (
              <input
                className="modal-edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
              />
            ) : (
              <h2 className="modal-title">{title}</h2>
            )}
            {note.createdAt && (
              <span className="modal-date">{formatDate(note.createdAt)}</span>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-divider" />

        {/* Content */}
        <div className="modal-content">
          {isEditing ? (
            <textarea
              className="modal-edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={8}
            />
          ) : (
            <p className="modal-text">
              {content || <span className="modal-empty">No content written.</span>}
            </p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="modal-footer">
          {isEditing ? (
            <>
              <button className="modal-btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="modal-btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button className="modal-btn-edit" onClick={() => setIsEditing(true)}>
              ✏️ Edit Note
            </button>
          )}
        </div>

      </div>
    </div>
  );
}