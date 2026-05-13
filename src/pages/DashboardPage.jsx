import { useState, useEffect } from "react";
import { getAllNotes, createNote, deleteNote } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import AddNoteForm from "../components/AddNoteForm";
import NoteModal from "../components/NoteModal";

export default function DashboardPage() {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ← search state
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await getAllNotes();
        setNotes(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load notes.");
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  // ── Search Filter ─────────────────────────────────────
  // User jo type kare us se notes filter ho
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleAddNote(noteData) {
    setIsAdding(true);
    try {
      const newNote = await createNote(noteData);
      if (newNote._id) {
        setNotes([newNote, ...notes]);
      }
    } catch {
      setError("Could not create note.");
    }
    setIsAdding(false);
  }

  async function handleDeleteNote(noteId) {
    setNotes(notes.filter((n) => n._id !== noteId));
    try {
      await deleteNote(noteId);
    } catch {
      setError("Could not delete note.");
    }
  }

  function handleUpdateNote(updatedNote) {
    setNotes(notes.map((n) =>
      n._id === updatedNote._id ? updatedNote : n
    ));
    setSelectedNote(updatedNote);
  }

  function openNote(note) { setSelectedNote(note); }
  function closeNote() { setSelectedNote(null); }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        {/* ── Header ── */}
        <div className="dashboard-header">
          <div className="greeting-block">
            <span className="greeting-time">{getGreeting()},</span>
            <h1 className="greeting-name">
              {user?.username || "there"} 👋
            </h1>
            <p className="greeting-sub">
              {notes.length === 0
                ? "Start capturing your ideas below."
                : `You have ${notes.length} note${notes.length !== 1 ? "s" : ""} saved.`}
            </p>
          </div>
          <div className="header-stat">
            <div className="stat-number">{notes.length}</div>
            <div className="stat-label">Total Notes</div>
          </div>
        </div>

        {error && <div className="alert alert-error dashboard-alert">{error}</div>}

        {/* ── Two Column Layout ── */}
        <div className="dashboard-grid">

          {/* LEFT: Add Note Form */}
          <div className="dashboard-sidebar">
            <AddNoteForm onAdd={handleAddNote} isAdding={isAdding} />
            <div className="sidebar-tip">
              <span className="tip-icon">💡</span>
              <p>Your notes are saved securely and only visible to you.</p>
            </div>
          </div>

          {/* RIGHT: Search + Notes */}
          <div className="dashboard-notes">

            {/* ── Search Box ── */}
            <div className="search-box">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Search notes by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* Search clear button — sirf tab dikhao jab kuch likha ho */}
              {searchQuery && (
                <button
                  className="search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading your notes...</p>
              </div>
            ) : (
              <>
                {/* Search result count dikhao */}
                {searchQuery && (
                  <p className="search-result-text">
                    {filteredNotes.length === 0
                      ? `No notes found for "${searchQuery}"`
                      : `${filteredNotes.length} note${filteredNotes.length !== 1 ? "s" : ""} found for "${searchQuery}"`
                    }
                  </p>
                )}

                {filteredNotes.length === 0 && !searchQuery ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No notes yet</h3>
                    <p>Create your first note using the form on the left.</p>
                  </div>
                ) : filteredNotes.length === 0 && searchQuery ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>No results found</h3>
                    <p>Try searching with a different title.</p>
                  </div>
                ) : (
                  <div className="notes-grid">
                    {filteredNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onDelete={handleDeleteNote}
                        onOpen={openNote}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <NoteModal
        note={selectedNote}
        onClose={closeNote}
        onUpdate={handleUpdateNote}
      />
    </div>
  );
}