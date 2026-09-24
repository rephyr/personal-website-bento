import React, { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import photo from "../assets/background.webp";

const MOVE = "0.7s ease-in-out";

// Darkens only the top of a collapsed card, where its title and hint sit
const SCRIM = "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 80%)";

function ExpandableCard({
  label,
  expanded,
  onExpand,
  onClose,
  dimmed,
  rect,
  viewport,
  world,
  children,
  collapsedContent,
  expandedContent,
  split = true,
  revealed = true,
  order = 0,
}) {
  const [hovered, setHovered] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const cardRef = useRef(null);
  const openRef = useRef(null);
  const closeRef = useRef(null);
  const wasExpanded = useRef(expanded);

  // Keep keyboard focus with the card as it opens and closes
  useEffect(() => {
    if (expanded) closeRef.current?.focus({ preventScroll: true });
    else if (wasExpanded.current) openRef.current?.focus({ preventScroll: true });
    wasExpanded.current = expanded;
  }, [expanded]);

  // Cards behind an open card can't be tabbed into
  useEffect(() => {
    if (cardRef.current) cardRef.current.inert = dimmed;
  }, [dimmed]);

  const box = expanded ? viewport : rect;
  const lifted = hovered && !expanded && !dimmed;

  const outerStyle = {
    position: "absolute",
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
    zIndex: expanded ? 100 : dimmed ? 5 : 10,
    // Hidden until the intro splits the photo; identical to the photo underneath, so it appears seamlessly
    opacity: !split ? 0 : dimmed ? 0.3 : 1,
    transform: lifted ? "scale(1.01)" : "scale(1)",
    transition: `top ${MOVE}, left ${MOVE}, width ${MOVE}, height ${MOVE}, z-index ${MOVE}, border-radius ${MOVE}, opacity 0.3s ease, transform 0.2s ease-out, box-shadow 0.3s ease-out`,
  };

  // Counter-translate so the image stays fixed in world space (curtain effect)
  const photoStyle = {
    position: "absolute",
    top: -box.top,
    left: -box.left,
    width: world.width,
    height: world.height,
    transition: `all ${MOVE}`,
  };

  return (
    <section
      ref={cardRef}
      role={expanded ? "dialog" : undefined}
      aria-modal={expanded || undefined}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={outerStyle}
      className={`bento-card group overflow-hidden bg-neutral-900 ring-1 ${
        split ? "rounded-2xl shadow-xl shadow-black/40" : "rounded-none"
      } ${lifted ? "ring-white/30" : "ring-transparent"} ${dimmed ? "pointer-events-none" : ""}`}
    >
      {/* Image layer — counter-translated, stays fixed in world space */}
      <div style={photoStyle} aria-hidden="true">
        <img
          src={photo}
          alt=""
          draggable={false}
          onLoad={() => setPhotoLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${photoLoaded ? "opacity-100" : "opacity-0"}`}
        />
        {/* Flashlight — off on an open card, where the flat dim already sits behind the content */}
        <div className="spotlight" style={{ opacity: revealed && !expanded ? 1 : 0 }} />
        <div className="spotlight-glow" style={{ opacity: revealed && !expanded ? 1 : 0 }} />
        <p
          className="absolute select-none text-[10px] italic text-white/50"
          style={{ bottom: "calc(var(--credit-inset) + 6px)", right: "calc(var(--credit-inset) + 24px)" }}
        >
          © Emilia Sipola. All rights reserved.
        </p>
      </div>

      {/* Scrims — gradient behind collapsed text, flat dim behind expanded content */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: SCRIM, opacity: expanded || !split ? 0 : 1, transition: `opacity ${MOVE}` }} />
      <div aria-hidden="true" className="absolute inset-0 bg-black/60" style={{ opacity: expanded ? 1 : 0, transition: `opacity ${MOVE}` }} />

      {/* Collapsed: the whole card is one button */}
      {!expanded && (
        <button
          ref={openRef}
          type="button"
          onClick={onExpand}
          aria-label={`Open ${label}`}
          aria-haspopup="dialog"
          className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
        />
      )}

      {/* Content layer — card-anchored. Clicks fall through to the button unless a child opts in with pointer-events-auto */}
      <div
        className="pointer-events-none absolute inset-0 z-20 flex flex-col p-5 xl:p-6"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "none" : "translateY(8px)",
          transition: `opacity 0.8s ease ${order * 110}ms, transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) ${order * 110}ms`,
        }}
      >
        <header className="flex items-start justify-between gap-3">
          {/* Title area — always visible, moves with card */}
          <div className="min-w-0">{children}</div>

          {expanded ? (
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={`Close ${label}`}
              className="pointer-events-auto -mr-1 -mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 bg-black/30 text-xl text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <FiX />
            </button>
          ) : (
            <FiArrowUpRight
              aria-hidden="true"
              className={`shrink-0 text-xl text-accent transition-all duration-200 group-focus-within:opacity-100 ${lifted ? "translate-x-0.5 -translate-y-0.5 opacity-100" : "opacity-0"}`}
            />
          )}
        </header>

        <div className="relative mt-3 min-h-0 flex-1">
          {/* Collapsed preview — fades out on expand */}
          {collapsedContent && (
            <div
              className="absolute inset-0"
              style={{
                opacity: expanded ? 0 : 1,
                visibility: expanded ? "hidden" : "visible",
                transition: expanded ? "opacity 0.2s ease, visibility 0s linear 0.2s" : "opacity 0.3s ease 0.5s",
              }}
            >
              {collapsedContent}
            </div>
          )}

          {/* Expanded detail — fades in after card finishes opening */}
          {expandedContent && (
            <div
              className="absolute inset-0 overflow-y-auto overscroll-contain"
              style={{
                opacity: expanded ? 1 : 0,
                visibility: expanded ? "visible" : "hidden",
                pointerEvents: expanded ? "auto" : "none",
                transition: expanded ? "opacity 0.4s ease 0.7s" : "opacity 0.15s ease, visibility 0s linear 0.15s",
              }}
            >
              {expandedContent}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ExpandableCard;
