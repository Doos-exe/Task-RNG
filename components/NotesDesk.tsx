"use client";

import { useState } from "react";
import { useTaskStore } from "@/lib/store";

const SUITS = ["♠", "♥", "♣", "♦"];

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
        <section className="notes-table" aria-label="Notes on the table">
          <div className="notes-table-heading">
            <div>
              <p className="eyebrow">Your notes</p>
              <h1 className="page-title">Cards on the table.</h1>
              <p className="page-subtitle mt-3">Keep your thoughts close. Select a card to read or change it.</p>
            </div>
            <span className="notes-count">{notes.length} {notes.length === 1 ? "card" : "cards"}</span>
          </div>

          <div className="notes-cards">
            {notes.map((note, index) => {
              const suit = SUITS[index % SUITS.length];
              const redSuit = suit === "♥" || suit === "♦";
              return (
                <button key={note.id} type="button" className={`note-card ${redSuit ? "note-card-red" : ""}`} onClick={() => editNote(note)} aria-label={`Open note: ${note.title}`}>
                  <span className="note-card-corner"><span>A</span><span>{suit}</span></span>
                  <span className="note-card-content">
                    <span className="note-card-suit" aria-hidden="true">{suit}</span>
                    <strong>{note.title}</strong>
                    <span>{note.body || "Tap to write more"}</span>
                  </span>
                  <span className="note-card-corner note-card-corner-bottom"><span>A</span><span>{suit}</span></span>
                </button>
              );
            })}
            <button type="button" className="note-card note-card-new" onClick={() => { resetEditor(); setShowEditor(true); }} aria-label="Add a note">
              <span className="note-card-new-mark" aria-hidden="true">+</span>
              <strong>New note</strong>
              <span>Deal a new card</span>
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
        <button type="button" className={`notes-deck ${open ? "notes-deck-open" : ""}`} onClick={toggleDeck} aria-expanded={open} aria-label={open ? "Close notes and return to dashboard" : "Open notes"}>
          <span className="notes-deck-lid" aria-hidden="true" />
          <span className="notes-deck-face">
            <span className="notes-deck-ornament" aria-hidden="true">♠</span>
            <span className="notes-deck-kicker">TASK RNG</span>
            <strong>THE NOTES</strong>
            <span className="notes-deck-divider" />
            <span className="notes-deck-detail">{open ? "CLOSE THE BOX" : "OPEN THE BOX"}</span>
            <span className="notes-deck-ornament" aria-hidden="true">♣</span>
          </span>
          <span className="notes-deck-bottom" aria-hidden="true" />
        </button>
        <p className="notes-deck-hint">{open ? "Click the box to return to your dashboard" : "Click the box to lay out your notes"}</p>
      </aside>
    </>
  );
}
