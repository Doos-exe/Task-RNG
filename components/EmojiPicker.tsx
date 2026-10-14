"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const EMOJI_LIST = [
  { emoji: "😊", tags: "smile happy face" },
  { emoji: "😁", tags: "grin happy face" },
  { emoji: "😂", tags: "laugh happy face" },
  { emoji: "🤣", tags: "laugh happy face" },
  { emoji: "😃", tags: "smile happy face" },
  { emoji: "😄", tags: "smile happy face" },
  { emoji: "😅", tags: "smile happy face" },
  { emoji: "😆", tags: "laugh happy face" },
  { emoji: "😉", tags: "wink happy face" },
  { emoji: "😌", tags: "relax happy face" },
  { emoji: "😍", tags: "love heart happy face" },
  { emoji: "🥰", tags: "love heart happy face" },
  { emoji: "😘", tags: "kiss love happy face" },
  { emoji: "😗", tags: "kiss love happy face" },
  { emoji: "😚", tags: "kiss love happy face" },
  { emoji: "😙", tags: "kiss love happy face" },
  { emoji: "🥲", tags: "smile happy face" },
  { emoji: "😋", tags: "tongue happy face" },
  { emoji: "😛", tags: "tongue happy face" },
  { emoji: "😜", tags: "tongue wink happy face" },
  { emoji: "🤪", tags: "tongue wink happy face" },
  { emoji: "😝", tags: "tongue happy face" },
  { emoji: "😒", tags: "disapprove sad face" },
  { emoji: "😏", tags: "smirk happy face" },
  { emoji: "😔", tags: "sad face" },
  { emoji: "😪", tags: "tired sad face" },
  { emoji: "🤤", tags: "drool happy face" },
  { emoji: "😴", tags: "sleep tired sad face" },
  { emoji: "😷", tags: "sick sad face" },
  { emoji: "🤒", tags: "sick sad face" },
  { emoji: "🤕", tags: "injured sad face" },
  { emoji: "🤢", tags: "sick sad face" },
  { emoji: "🤮", tags: "sick sad face" },
  { emoji: "🤧", tags: "sick sad face" },
  { emoji: "🤑", tags: "money happy face" },
  { emoji: "🤠", tags: "cowboy happy face" },
  { emoji: "🥳", tags: "party celebrate happy face" },
  { emoji: "😎", tags: "cool happy face" },
  { emoji: "🤓", tags: "nerd smart happy face" },
  { emoji: "🧐", tags: "thinking smart happy face" },
  { emoji: "😕", tags: "confused sad face" },
  { emoji: "😟", tags: "worried sad face" },
  { emoji: "🙁", tags: "frown sad face" },
  { emoji: "☹️", tags: "frown sad face" },
  { emoji: "😲", tags: "shocked surprised face" },
  { emoji: "😳", tags: "shocked surprised face" },
  { emoji: "😥", tags: "sad disappointed face" },
  { emoji: "😢", tags: "sad cry face" },
  { emoji: "😭", tags: "cry sad face" },
  { emoji: "😱", tags: "shocked scared face" },
  { emoji: "😖", tags: "anguish sad face" },
  { emoji: "😣", tags: "persevere sad face" },
  { emoji: "😞", tags: "disappointed sad face" },
  { emoji: "😓", tags: "sweat sad face" },
  { emoji: "😩", tags: "weary tired sad face" },
  { emoji: "😫", tags: "tired sad face" },
  { emoji: "🥱", tags: "yawn tired sad face" },
  { emoji: "😤", tags: "rage angry face" },
  { emoji: "😡", tags: "angry rage face" },
  { emoji: "😠", tags: "angry rage face" },
  { emoji: "🤬", tags: "angry rage face" },
  { emoji: "😈", tags: "devil evil angry face" },
  { emoji: "👿", tags: "angry devil evil face" },
  { emoji: "💀", tags: "skull death skull" },
  { emoji: "☠️", tags: "skull death skull" },
  { emoji: "💩", tags: "poop funny" },
  { emoji: "🤡", tags: "clown funny" },
  { emoji: "👹", tags: "demon evil angry face" },
  { emoji: "👺", tags: "goblin evil demon face" },
  { emoji: "👻", tags: "ghost spooky face" },
  { emoji: "👽", tags: "alien ufo space" },
  { emoji: "👾", tags: "alien robot ufo space" },
  { emoji: "🤖", tags: "robot android face" },
  { emoji: "😺", tags: "cat happy face" },
  { emoji: "😸", tags: "cat happy face" },
  { emoji: "😹", tags: "cat laugh happy face" },
  { emoji: "😻", tags: "cat love heart happy face" },
  { emoji: "😼", tags: "cat smirk happy face" },
  { emoji: "😽", tags: "cat kissing happy face" },
  { emoji: "🙀", tags: "cat weary sad face" },
  { emoji: "😿", tags: "cat cry sad face" },
  { emoji: "😾", tags: "cat angry rage face" },
  { emoji: "💋", tags: "kiss love" },
  { emoji: "👋", tags: "wave hand" },
  { emoji: "🤚", tags: "wave hand" },
  { emoji: "🖐️", tags: "hand palm" },
  { emoji: "✋", tags: "hand palm stop" },
  { emoji: "🖖", tags: "hand vulcan spock" },
  { emoji: "👌", tags: "hand ok gesture" },
  { emoji: "🤌", tags: "hand pinch gesture" },
  { emoji: "🤏", tags: "hand small gesture" },
  { emoji: "✌️", tags: "hand peace victory" },
  { emoji: "🤞", tags: "hand fingers crossed" },
  { emoji: "🫰", tags: "hand wink gesture" },
  { emoji: "🤟", tags: "hand love you gesture" },
  { emoji: "🤘", tags: "hand rock metal gesture" },
  { emoji: "🤙", tags: "hand call me gesture" },
  { emoji: "👍", tags: "hand thumbs up like" },
  { emoji: "👎", tags: "hand thumbs down dislike" },
  { emoji: "✊", tags: "hand fist punch" },
  { emoji: "👊", tags: "hand fist punch" },
  { emoji: "🤛", tags: "hand fist punch" },
  { emoji: "🤜", tags: "hand fist punch" },
  { emoji: "👏", tags: "hand clap applause" },
  { emoji: "🙌", tags: "hand raised celebrate" },
  { emoji: "👐", tags: "hand open arms" },
  { emoji: "🤲", tags: "hand open palm" },
  { emoji: "🤝", tags: "hand handshake agree" },
  { emoji: "🎯", tags: "target goal aim" },
  { emoji: "⭐", tags: "star favorite" },
  { emoji: "🌟", tags: "star sparkle favorite" },
  { emoji: "✨", tags: "sparkle shine glitter" },
  { emoji: "⚡", tags: "lightning bolt power energy" },
  { emoji: "🔥", tags: "fire hot flame" },
  { emoji: "💥", tags: "explosion boom" },
  { emoji: "💫", tags: "dizzy star sparkle" },
  { emoji: "🌈", tags: "rainbow color sky" },
  { emoji: "🎪", tags: "circus tent carnival" },
  { emoji: "🎨", tags: "palette art paint" },
  { emoji: "🎭", tags: "mask theater drama" },
  { emoji: "🎬", tags: "film movie camera" },
  { emoji: "🎤", tags: "microphone music sing" },
  { emoji: "🎧", tags: "headphones music listen" },
  { emoji: "🎮", tags: "game controller play" },
  { emoji: "🎲", tags: "dice game luck" },
  { emoji: "🎳", tags: "bowling game" },
  { emoji: "🏀", tags: "basketball ball sport" },
  { emoji: "⚽", tags: "soccer football ball sport" },
  { emoji: "🏈", tags: "football ball sport" },
  { emoji: "⚾", tags: "baseball ball sport" },
  { emoji: "🥎", tags: "softball ball sport" },
  { emoji: "🎾", tags: "tennis ball sport" },
  { emoji: "🏐", tags: "volleyball ball sport" },
  { emoji: "🏉", tags: "rugby ball sport" },
  { emoji: "🥏", tags: "kickball ball sport" },
  { emoji: "🍕", tags: "pizza food eat" },
  { emoji: "🍔", tags: "hamburger food eat" },
  { emoji: "🍟", tags: "fries food eat" },
  { emoji: "🌭", tags: "hotdog food eat" },
  { emoji: "🥪", tags: "sandwich food eat" },
  { emoji: "🌮", tags: "taco food eat" },
  { emoji: "🌯", tags: "burrito food eat" },
  { emoji: "🥙", tags: "stuffed flatbread food eat" },
  { emoji: "🧆", tags: "falafel food eat" },
  { emoji: "🍗", tags: "chicken food eat" },
  { emoji: "🍖", tags: "meat food eat" },
  { emoji: "🎂", tags: "cake food dessert" },
  { emoji: "🍰", tags: "cake food dessert" },
  { emoji: "🧁", tags: "cupcake food dessert" },
  { emoji: "🍪", tags: "cookie food dessert" },
  { emoji: "🍩", tags: "donut food dessert" },
  { emoji: "🍫", tags: "chocolate food dessert" },
  { emoji: "🍬", tags: "candy food dessert" },
  { emoji: "🍭", tags: "lollipop candy food dessert" },
  { emoji: "🍮", tags: "pudding food dessert" },
  { emoji: "🍯", tags: "honey food dessert" },
  { emoji: "🍼", tags: "milk baby drink" },
  { emoji: "☕", tags: "coffee drink caffeine" },
  { emoji: "🍵", tags: "tea drink" },
  { emoji: "🍶", tags: "sake drink" },
  { emoji: "🍾", tags: "champagne bottle drink" },
  { emoji: "🍷", tags: "wine drink" },
  { emoji: "🍸", tags: "cocktail drink" },
  { emoji: "🍹", tags: "tropical drink cocktail" },
  { emoji: "🍺", tags: "beer drink" },
  { emoji: "🍻", tags: "beer drink" },
  { emoji: "🥂", tags: "champagne toast drink" },
  { emoji: "🥃", tags: "bowl drink" },
  { emoji: "🏆", tags: "trophy award win" },
  { emoji: "🥇", tags: "medal gold award win" },
  { emoji: "🥈", tags: "medal silver award" },
  { emoji: "🥉", tags: "medal bronze award" },
  { emoji: "🏅", tags: "medal award" },
  { emoji: "🎖️", tags: "medal award" },
  { emoji: "🏵️", tags: "flower rosette award" },
  { emoji: "🎗️", tags: "ribbon award" },
  { emoji: "🎀", tags: "ribbon bow" },
  { emoji: "🎁", tags: "gift present" },
  { emoji: "🎈", tags: "balloon party celebrate" },
  { emoji: "🎉", tags: "party popper celebrate" },
  { emoji: "🎊", tags: "confetti ball celebrate" },
  { emoji: "✉️", tags: "envelope mail letter" },
  { emoji: "📩", tags: "inbox envelope mail" },
  { emoji: "📨", tags: "envelope mail letter" },
  { emoji: "📤", tags: "outbox envelope mail" },
  { emoji: "📥", tags: "inbox envelope mail" },
  { emoji: "📦", tags: "package box mail" },
  { emoji: "🏷️", tags: "label tag badge" },
  { emoji: "⌨️", tags: "keyboard computer" },
  { emoji: "✏️", tags: "pencil write edit" },
  { emoji: "✒️", tags: "pen write edit" },
  { emoji: "🖋️", tags: "fountain pen write edit" },
  { emoji: "🖊️", tags: "pen write edit" },
  { emoji: "🖌️", tags: "paintbrush art draw" },
  { emoji: "🖍️", tags: "crayon art draw" },
  { emoji: "📠", tags: "fax machine" },
  { emoji: "📱", tags: "phone mobile device" },
  { emoji: "☎️", tags: "telephone phone" },
  { emoji: "📞", tags: "telephone phone" },
  { emoji: "📟", tags: "pager phone" },
  { emoji: "📲", tags: "phone mobile device" },
  { emoji: "💻", tags: "computer laptop device" },
  { emoji: "🖥️", tags: "desktop computer device" },
  { emoji: "🖨️", tags: "printer device" },
  { emoji: "🖱️", tags: "mouse computer device" },
  { emoji: "🖲️", tags: "trackball computer device" },
  { emoji: "🕹️", tags: "joystick game device" },
  { emoji: "🗜️", tags: "clamp compress tool" },
  { emoji: "💽", tags: "disk computer device" },
  { emoji: "💾", tags: "floppy disk computer device" },
  { emoji: "💿", tags: "cd compact disk computer device" },
  { emoji: "📀", tags: "dvd disk computer device" },
  { emoji: "🧮", tags: "abacus calculator math" },
  { emoji: "🎥", tags: "movie camera video film" },
  { emoji: "📺", tags: "television tv watch" },
  { emoji: "📷", tags: "camera photo picture" },
  { emoji: "📸", tags: "camera photo picture" },
  { emoji: "📹", tags: "camera video record" },
  { emoji: "🎞️", tags: "film frames movie" },
  { emoji: "📽️", tags: "film projector movie" },
  { emoji: "🎦", tags: "movie camera film" },
  { emoji: "📌", tags: "pushpin pin attach" },
  { emoji: "📍", tags: "round pushpin pin attach" },
  { emoji: "📎", tags: "paperclip attach paper" },
  { emoji: "🖇️", tags: "paperclips attach paper" },
  { emoji: "📐", tags: "triangular ruler math measure" },
  { emoji: "📏", tags: "straight ruler math measure" },
  { emoji: "🧭", tags: "compass navigation direction" },
  { emoji: "📓", tags: "notebook memo note" },
  { emoji: "📔", tags: "notebook memo note" },
  { emoji: "📒", tags: "ledger memo note" },
  { emoji: "📕", tags: "closed book read" },
  { emoji: "📗", tags: "green book read" },
  { emoji: "📘", tags: "blue book read" },
  { emoji: "📙", tags: "orange book read" },
  { emoji: "📚", tags: "books read library" },
  { emoji: "📖", tags: "book open read" },
  { emoji: "🧷", tags: "safety pin cloth" },
  { emoji: "🧵", tags: "thread needle sew" },
  { emoji: "🧶", tags: "yarn ball knit" },
  { emoji: "🎒", tags: "backpack bag school" },
  { emoji: "🎓", tags: "graduation cap hat school" },
  { emoji: "🎩", tags: "top hat formal" },
  { emoji: "👑", tags: "crown king queen" },
  { emoji: "⛑️", tags: "helmet hat safety" },
  { emoji: "🥾", tags: "hiking boot shoes" },
  { emoji: "👞", tags: "man shoe shoes" },
  { emoji: "👟", tags: "running shoe shoes" },
  { emoji: "🥿", tags: "sandal shoe shoes" },
  { emoji: "👠", tags: "high heel shoe shoes" },
  { emoji: "👡", tags: "woman sandal shoe shoes" },
  { emoji: "🩰", tags: "ballet shoe dancing" },
  { emoji: "👢", tags: "woman boot shoes" },
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customInput, setCustomInput] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({ position: "fixed", visibility: "hidden" });


  const filteredEmojis = EMOJI_LIST.filter(
    (item) =>
      item.emoji.includes(searchTerm) ||
      item.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    if (!isOpen) {
      setPickerStyle({ position: "fixed", visibility: "hidden" });
      return;
    }

    const updatePosition = () => {
      if (!buttonRef.current || !pickerRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const pickerRect = pickerRef.current.getBoundingClientRect();
      const margin = 8;
      const gap = 8;
      const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
      const viewportHeight = window.innerHeight;
      const pickerWidth = Math.min(pickerRect.width || 384, viewportWidth - margin * 2);
      const naturalHeight = pickerRef.current.scrollHeight;
      const spaceBelow = Math.max(0, viewportHeight - buttonRect.bottom - margin - gap);
      const spaceAbove = Math.max(0, buttonRect.top - margin - gap);
      const preferredHeight = Math.min(naturalHeight, 520);
      const placeBelow = spaceBelow >= preferredHeight || spaceBelow >= spaceAbove;
      const availableHeight = Math.max(180, placeBelow ? spaceBelow : spaceAbove);
      const panelHeight = Math.min(naturalHeight, availableHeight);
      const maxLeft = Math.max(margin, viewportWidth - pickerWidth - margin);
      const preferredLeft = buttonRect.right - pickerWidth;
      const left = Math.min(Math.max(margin, preferredLeft), maxLeft);
      const preferredTop = placeBelow
        ? buttonRect.bottom + gap
        : buttonRect.top - panelHeight - gap;
      const maxTop = Math.max(margin, viewportHeight - panelHeight - margin);
      const top = Math.min(Math.max(margin, preferredTop), maxTop);

      setPickerStyle({
        position: "fixed",
        left: left + "px",
        top: top + "px",
        width: pickerWidth + "px",
        maxHeight: panelHeight + "px",
        zIndex: 9999,
        visibility: "visible",
      });
    };

    const frame = window.requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, searchTerm]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        buttonRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCustomEmojiAdd = () => {
    if (customInput.trim()) {
      onChange(customInput.slice(0, 2));
      setCustomInput("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="app-field min-w-16 cursor-pointer overflow-hidden text-center text-2xl transition hover:border-[var(--app-accent)]"
        title="Pick an emoji"
      >
        {value || "😊"}
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          ref={pickerRef}
          style={pickerStyle}
          className="app-surface fixed flex w-96 max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-2xl p-3 shadow-2xl"
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search emojis... (e.g., smile, heart, food)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="app-field mb-3 w-full text-sm"
          />

          {/* Emoji Grid */}
          <div className="overflow-y-auto flex-1 mb-3">
            <div className="grid grid-cols-8 gap-2">
              {filteredEmojis.length > 0 ? (
                filteredEmojis.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onChange(item.emoji);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className="rounded-lg p-2 text-2xl transition hover:bg-amber-400/20 cursor-pointer"
                    title={item.tags}
                  >
                    {item.emoji}
                  </button>
                ))
              ) : (
                <div className="col-span-8 text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                  No emojis found
                </div>
              )}
            </div>
          </div>

          {/* Custom Emoji Input */}
          <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
              Custom Emoji (copy & paste)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste custom emoji"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCustomEmojiAdd()}
                maxLength={2}
                className="app-field flex-1 text-sm"
              />
              <button
                onClick={handleCustomEmojiAdd}
                disabled={!customInput.trim()}
                className="app-button app-button-primary px-3 text-xs"
              >
                Add
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
