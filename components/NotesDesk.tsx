"use client";

import { useState } from "react";
import { useTaskStore } from "@/lib/store";

const SUITS = ["♠", "♥", "♣", "♦"] as const;
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;
const PIP_LAYOUTS: Record<string, readonly (readonly [number, number])[]> = {
  A: [[50, 50]],
  "2": [[50, 12], [50, 88]],
  "3": [[50, 12], [50, 50], [50, 88]],
  "4": [[22, 12], [78, 12], [22, 88], [78, 88]],
  "5": [[22, 12], [78, 12], [50, 50], [22, 88], [78, 88]],
  "6": [[22, 12], [78, 12], [22, 50], [78, 50], [22, 88], [78, 88]],
  "7": [[22, 12], [78, 12], [50, 31], [22, 50], [78, 50], [22, 88], [78, 88]],
  "8": [[22, 12], [78, 12], [50, 31], [22, 50], [78, 50], [50, 69], [22, 88], [78, 88]],
  "9": [[22, 12], [78, 12], [22, 37], [78, 37], [50, 50], [22, 63], [78, 63], [22, 88], [78, 88]],
  "10": [[22, 12], [78, 12], [50, 25], [22, 37], [78, 37], [22, 63], [78, 63], [50, 75], [22, 88], [78, 88]],
};

// Derive the face from the saved ID so editing or removing notes never reshuffles it.
function getCardFace(id: string) {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash = Math.imul(hash ^ id.charCodeAt(index), 16777619);
  }
  const card = (hash >>> 0) % 52;
  return { rank: RANKS[card % RANKS.length], suit: SUITS[Math.floor(card / RANKS.length)] };
}

function CardArtwork({ rank, suit }: ReturnType<typeof getCardFace>) {
  const pips = PIP_LAYOUTS[rank];

  return (
    <span className={"note-card-art" + (rank === "A" ? " note-card-art-ace" : "")} aria-hidden="true">
      {pips ? pips.map(([x, y], index) => (
        <span
          key={index}
          className={"note-card-pip" + (y > 50 ? " note-card-pip-inverted" : "")}
          style={{ left: x + "%", top: y + "%" }}
        >
          {suit}
        </span>
      )) : (
        <span className="note-card-court">
          <svg className="note-card-crown" viewBox="0 0 40 28" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 20 4 7l10 6 6-10 6 10 10-6-3 13H7Zm0 5h26" strokeLinejoin="round" />
            <circle cx="4" cy="5" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="20" cy="2" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="36" cy="5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          <span className="note-card-court-rank">{rank}</span>
          <span className="note-card-court-suit">{suit}</span>
        </span>
      )}
    </span>
  );
}

export function NotesDesk({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const notes = useTaskStore((state) => state.notes);
  const addNote = useTaskStore((state) => state.addNote);
  const updateNote = useTaskStore((state) => state.updateNote);
  const removeNote = useTaskStore((state) => state.removeNote);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  const resetEditor = () => {
    setEditingId(null);
    setTitle("");
    setBody("");
    setShowEditor(false);
  };

  const editNote = (note: (typeof notes)[number]) => {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setShowEditor(true);
  };

  const saveNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle && !trimmedBody) return;
    if (editingId) updateNote(editingId, trimmedTitle || "Untitled note", trimmedBody);
    else addNote(trimmedTitle || "Untitled note", trimmedBody);
    resetEditor();
  };

  const toggleDeck = () => {
    resetEditor();
    onToggle();
  };

  return (
    <>
      {open && (
        <section id="notes-table" className="notes-table" aria-label="Notes on the table">
          <div className="notes-table-heading">
            <div>
              <p className="eyebrow">Your personal deck</p>
              <h1 className="page-title">Cards on the table.</h1>
              <p className="page-subtitle mt-3">Ideas, reminders, and a little room to think. Pick a card to make it yours.</p>
            </div>
            <span className="notes-count"><span aria-hidden="true">♠</span> {notes.length} {notes.length === 1 ? "card" : "cards"}</span>
          </div>

          <div className="notes-cards">
            {notes.map((note) => {
              const { rank, suit } = getCardFace(note.id);
              const redSuit = suit === "♥" || suit === "♦";
              return (
                <button
                  key={note.id}
                  type="button"
                  className={"note-card" + (redSuit ? " note-card-red" : "")}
                  onClick={() => editNote(note)}
                  aria-label={"Open note: " + note.title}
                >
                  <span className="note-card-corner" aria-hidden="true"><span>{rank}</span><span>{suit}</span></span>
                  <CardArtwork rank={rank} suit={suit} />
                  <span className="note-card-content">
                    <strong>{note.title}</strong>
                    <span className="note-card-preview">{note.body || "A thought waiting to happen."}</span>
                  </span>
                  <span className="note-card-footer" aria-hidden="true">Read note <span>↗</span></span>
                  <span className="note-card-corner note-card-corner-bottom" aria-hidden="true"><span>{rank}</span><span>{suit}</span></span>
                </button>
              );
            })}
            <button type="button" className="note-card note-card-new" onClick={() => { resetEditor(); setShowEditor(true); }} aria-label="Add a note">
              <span className="note-card-new-suits" aria-hidden="true">♠ <span>♥</span> ♣ <span>♦</span></span>
              <span className="note-card-new-mark" aria-hidden="true">+</span>
              <strong>A fresh card</strong>
              <span className="note-card-new-copy">Make room for<br />your next idea.</span>
              <span className="note-card-new-label">Add a note <span aria-hidden="true">↗</span></span>
            </button>
          </div>

          {showEditor && (
            <form className="note-editor" onSubmit={saveNote}>
              <div className="note-editor-top">
                <h2>{editingId ? "Edit your note" : "New note"}</h2>
                <button type="button" className="note-editor-close" onClick={resetEditor} aria-label="Close note editor">×</button>
              </div>
              <label htmlFor="note-title">Title</label>
              <input id="note-title" className="app-field" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} placeholder="Give this card a title" autoFocus />
              <label htmlFor="note-body">Note</label>
              <textarea id="note-body" className="app-field note-editor-body" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write what is on your mind…" />
              <div className="note-editor-actions">
                {editingId && <button type="button" className="note-delete" onClick={() => { removeNote(editingId); resetEditor(); }}>Delete card</button>}
                <button type="button" className="app-button app-button-ghost" onClick={resetEditor}>Cancel</button>
                <button type="submit" className="app-button app-button-primary" disabled={!title.trim() && !body.trim()}>Save card</button>
              </div>
            </form>
          )}
        </section>
      )}

      <aside className="notes-deck-area" aria-label="Notes card box">
        <button
          type="button"
          className={"notes-deck" + (open ? " notes-deck-open" : "")}
          onClick={toggleDeck}
          aria-expanded={open}
          aria-controls={open ? "notes-table" : undefined}
          aria-describedby="notes-deck-hint"
          aria-label={open ? "Close notes and return to dashboard" : "Open notes"}
        >
          <svg className="notes-box-art" viewBox="0 0 260 380" fill="none" aria-hidden="true">
            <ellipse className="notes-box-shadow" cx="132" cy="362" rx="108" ry="10" />
            <path className="notes-box-back" d="M57 66H239V328H57Z" />

            <g className="notes-box-flap">
              <path className="notes-box-flap-paper" d="M57 66 43 20Q40 10 51 10H215Q224 10 227 20L239 66Z" />
              <path className="notes-box-fold" d="M57 65H239M52 23H218" />
              <text className="notes-box-flap-label" x="140" y="47" textAnchor="middle">A GOOD IDEA STARTS HERE</text>
            </g>

            <path className="notes-box-mouth" d="M20 90 57 66H239L202 90V111H20Z" />
            <g className="notes-box-stack">
              <rect className="notes-box-card-edge" x="40" y="75" width="157" height="239" rx="4" />
              <rect className="notes-box-card-edge" x="36" y="80" width="160" height="239" rx="4" />
              <rect className="notes-box-card" x="31" y="86" width="164" height="239" rx="5" />
              <path className="notes-box-card-lines" d="M41 78H192M37 83H191M37 91H189V317H37Z" />
              <text className="notes-box-card-rank" x="43" y="104">A</text>
              <text className="notes-box-card-suit" x="43" y="117">♠</text>
              <text className="notes-box-card-mark" x="113" y="119" textAnchor="middle">♠</text>
            </g>

            <g className="notes-box-dust-flaps">
              <path className="notes-box-flap-paper" d="M20 90 4 71 42 48 57 66Z" />
              <path className="notes-box-flap-paper" d="M202 90 218 70 253 49 239 66Z" />
              <path className="notes-box-fold" d="M20 90 57 66M202 90 239 66" />
            </g>

            <g className="notes-box-closed-top">
              <path className="notes-box-top" d="M20 90 57 66H239L202 90Z" />
              <path className="notes-box-tuck" d="M20 90H202V113H20Z" />
              <path className="notes-box-fold" d="M24 87H199L232 68M57 66 62 73H224" />
              <text className="notes-box-top-label" transform="matrix(1 0 -.8 .6 128 82)" textAnchor="middle">THE NOTES</text>
              <path className="notes-box-tab" d="M94 90H130V106H94Z" />
            </g>

            <path className="notes-box-side" d="M202 90 239 66V328L202 352Z" />
            <path className="notes-box-side-shade" d="M231 72 239 66V328L231 333Z" />
            <path className="notes-box-side-seam" d="M207 96 233 79M207 337 233 320" />
            <text className="notes-box-spine" transform="translate(223 211) rotate(-90)" textAnchor="middle">TASK RNG · THE NOTES</text>
            <path className="notes-box-side-mark" d="m216 295 6-4v9l-6 4Zm0 13 6-4v3l-6 4Z" />

            <path className="notes-box-front" d="M20 90H91C91 109 131 109 131 90H202V352H20Z" />
            <path className="notes-box-front-fold" d="M21 347H201M25 94V344" />
            <path className="notes-box-print-frame" d="M33 122H189V330H33Z" />
            <path className="notes-box-brand-band" d="M33 122H189V153H33Z" />
            <text className="notes-box-brand" x="111" y="142" textAnchor="middle">TASK RNG</text>
            <text className="notes-box-the" x="111" y="176" textAnchor="middle">THE</text>
            <text className="notes-box-name" x="111" y="207" textAnchor="middle">NOTES</text>
            <path className="notes-box-ornament" d="M65 216H98m26 0h33M70 238c-13 10-13 26 0 36m82-36c13 10 13 26 0 36" />
            <path className="notes-box-emblem" transform="translate(79 223) scale(2.7)" d="M12 1.5C9.5 5.7 2 8.7 2 14a5 5 0 0 0 8.7 3.4c-.4 2.4-1.5 4-3.2 5.1h9c-1.7-1.1-2.8-2.7-3.2-5.1A5 5 0 0 0 22 14c0-5.3-7.5-8.3-10-12.5Z" />
            <text className="notes-box-suits" x="111" y="305" textAnchor="middle">♠ ♥ ♣ ♦</text>
            <text className="notes-box-edition" x="111" y="320" textAnchor="middle">IDEAS WORTH KEEPING</text>
            <text className="notes-box-bottom-label" x="111" y="342" textAnchor="middle">PERSONAL NOTE CARDS</text>
          </svg>
        </button>
        <div className="notes-deck-caption">
          <p className="notes-deck-count">{notes.length === 0 ? "Your next idea starts here" : notes.length + (notes.length === 1 ? " card in your collection" : " cards in your collection")}</p>
          <button type="button" className="notes-deck-action" onClick={toggleDeck}>
            {open && <span aria-hidden="true">←</span>}
            {open ? "Return to dashboard" : "Open your notes"}
            {!open && <span aria-hidden="true">↗</span>}
          </button>
          <p id="notes-deck-hint" className="notes-deck-hint">{open ? "Close the box. Come back anytime." : "Little thoughts. Endless possibilities."}</p>
        </div>
      </aside>
    </>
  );
}
