import { useState } from "react";

export default function NoteCard({ note, onDelete, onOpen }) {

  const [copied, setCopied] = useState(false);

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
  }

  const badge = note.title?.charAt(0).toUpperCase() || "N";

  // ── 1. COPY TO CLIPBOARD ──────────────────────────────
  function handleCopy(e) {
    e.stopPropagation();
    const text = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2 sec baad wapas
  }

  // ── 2. DOWNLOAD AS PDF ────────────────────────────────
  function handleDownloadPDF(e) {
    e.stopPropagation();
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${note.title}</title>
          <style>
            body { font-family: Georgia, serif; max-width: 700px; margin: 60px auto; color: #111; line-height: 1.8; }
            h1 { font-size: 28px; margin-bottom: 8px; }
            .date { color: #888; font-size: 13px; margin-bottom: 32px; }
            p { font-size: 16px; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <div class="date">${formatDate(note.createdAt)}</div>
          <p>${note.content || ""}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print(); // ← Browser ka print/save as PDF dialog khulega
  }

  // ── 3. SHARE NOTE ─────────────────────────────────────
  function handleShare(e) {
    e.stopPropagation();
    const text = `📝 ${note.title}\n\n${note.content}`;

    // Agar browser Web Share API support karta hai (mobile pe)
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: text,
      });
    } else {
      // Desktop pe — link copy kar lo
      navigator.clipboard.writeText(text);
      alert("Note content copied! You can now share it anywhere.");
    }
  }

  // ── 4. EDIT ───────────────────────────────────────────
  function handleEdit(e) {
    e.stopPropagation();
    onOpen(note); // ← Modal khulega jahan edit button hai
  }

  return (
    <div className="note-card" onClick={() => onOpen(note)}>
      <div className="note-card-inner">
        <div className="note-badge">{badge}</div>
        <div className="note-content">
          <h3 className="note-title">{note.title}</h3>
          {note.content && <p className="note-body">{note.content}</p>}
          {note.createdAt && (
            <span className="note-date">{formatDate(note.createdAt)}</span>
          )}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="note-actions">

        {/* Edit Button */}
        <button
          className="action-btn edit-btn"
          onClick={handleEdit}
          title="Edit note"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        {/* Copy Button */}
        <button
          className={`action-btn copy-btn ${copied ? "copied" : ""}`}
          onClick={handleCopy}
          title="Copy content"
        >
          {copied ? (
            // Copied! checkmark dikhao
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>

        {/* Download PDF Button */}
        <button
          className="action-btn pdf-btn"
          onClick={handleDownloadPDF}
          title="Download as PDF"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        {/* Share Button */}
        <button
          className="action-btn share-btn"
          onClick={handleShare}
          title="Share note"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>

        {/* Delete Button */}
        <button
          className="action-btn delete-btn"
          onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
          title="Delete note"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>

      </div>
    </div>
  );
}