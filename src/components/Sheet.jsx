import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";

// Intro split, same as the original bento
const MOVE = "0.7s ease-in-out";

// Durations (ms); the curves live in index.css
const OPEN = 950;
const CLOSE = 800;
const PEEK = 20; // how far a layer slides out past its cell on hover: the gutter and a little more

// Darkens only the top of a collapsed card, where its title and hint sit
const SCRIM = "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 80%)";

// clip-path for a window onto a full-size layer
function insetOf(r, world, grow, round) {
  const top = r.top - grow;
  const left = r.left - grow;
  const right = world.width - r.left - r.width - grow;
  const bottom = world.height - r.top - r.height - grow;
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${round}px)`;
}

// Wrap blocks of opened content in this: they develop in one after another
export function Develop({ i = 0, as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag className={`develop ${className}`} style={{ "--i": i }} {...rest}>
      {children}
    </Tag>
  );
}

function Sheet({ sheet, label, title, hint, children }) {
  const {
    order, count, rect, world, openRect, column, stacked, radius,
    state, peekVia, split, revealed, reduced, photo, onOpen, onClose, onPeek,
  } = sheet;
  const isOpen = state === "open";
  const peeking = state === "peek";
  const titleId = useId();

  const sectionRef = useRef(null);
  const openRef = useRef(null);
  const closeRef = useRef(null);
  const headerRef = useRef(null);
  const plateRef = useRef(null);
  const [photoLoaded, setPhotoLoaded] = useState(false);

  // Layers under an open one can't be reached
  const unreachable = state === "dim";
  useEffect(() => {
    if (sectionRef.current) sectionRef.current.inert = unreachable;
  }, [unreachable]);

  const prev = useRef(state);
  const from = prev.current;
  useEffect(() => {
    prev.current = state;
  }, [state]);

  // Keep keyboard focus with the layer as it opens and closes
  const wasOpen = useRef(isOpen);
  const restoringFocus = useRef(false);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    let timers = [];
    if (isOpen) {
      closeRef.current?.focus({ preventScroll: true });
    } else if (wasOpen.current) {
      // Focus goes back to the trigger (its ring waits until the window is home),
      // without the layer sliding back out as if it were hovered
      restoringFocus.current = true;
      setClosing(true);
      openRef.current?.focus({ preventScroll: true });
      timers = [
        setTimeout(() => { restoringFocus.current = false; }, 200),
        setTimeout(() => setClosing(false), reduced ? 0 : CLOSE + 100),
      ];
      plateRef.current?.scrollTo({ top: 0 });
    }
    wasOpen.current = isOpen;
    return () => timers.forEach(clearTimeout);
  }, [isOpen, reduced]);

  // Phones: the opened text starts under the title, wherever the title ends up
  const [headerHeight, setHeaderHeight] = useState(0);
  useLayoutEffect(() => {
    if (isOpen && stacked && headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
  }, [isOpen, stacked]);

  // Soft edges on a scrolling column: fade the bottom while there's more, the top once scrolled
  const [edges, setEdges] = useState({ above: false, below: false });
  const measure = (el) => {
    if (!el) return;
    const above = el.scrollTop > 4;
    const below = el.scrollTop + el.clientHeight < el.scrollHeight - 4;
    setEdges((s) => (s.above === above && s.below === below ? s : { above, below }));
  };
  useEffect(() => {
    if (!isOpen) {
      setEdges({ above: false, below: false });
      return;
    }
    const t = setTimeout(() => measure(plateRef.current), reduced ? 250 : 1500);
    return () => clearTimeout(t);
  }, [isOpen, reduced, world.width, world.height]);

  /* ---------- the window ---------- */

  const grow = peeking ? PEEK : 0;
  const win = isOpen ? openRect : rect;
  const round = isOpen ? 16 : radius + grow / 5;
  const ring = peekVia === "focus" ? 2 : 1;
  const outerClip = insetOf(win, world, grow, round);
  const innerClip = insetOf(win, world, peeking ? grow - ring : 0, round);

  let move;
  if (reduced) move = "0s";
  else if (!revealed) move = MOVE;
  else if (isOpen) move = `${OPEN}ms var(--ease-reveal)`;
  else if (from === "open") move = `${CLOSE}ms var(--ease-reveal) 60ms`;
  else move = "420ms var(--ease-out)";
  const clipTransition = reduced ? "none" : `clip-path ${move}`;

  // The title block rides the window's top-left corner as it grows, so it lands top-left
  const cornerShift = isOpen ? `translate3d(${openRect.left - rect.left}px, ${openRect.top - rect.top}px, 0)` : "none";

  /* ---------- the layer as a whole ---------- */

  const onTop = isOpen || closing || from === "open";
  const zIndex = onTop ? 40 : peeking ? 30 : 10;
  // Hidden until the intro splits the photo; identical to the photo underneath, so it appears seamlessly
  const groupOpacity = !split ? 0 : state === "dim" ? (stacked ? 0.3 : 0.4) : state === "shade" ? 0.84 : 1;
  const groupTransform = state === "dim" && !stacked ? "scale(0.985)" : "none";
  let groupTransition;
  if (reduced) groupTransition = "opacity 200ms ease";
  else if (state === "dim") groupTransition = "opacity 650ms ease, transform 900ms var(--ease-reveal)";
  else if (from === "dim") groupTransition = "opacity 500ms ease 300ms, transform 800ms var(--ease-out) 150ms";
  else groupTransition = "opacity 350ms ease";

  /* ---------- shadows ---------- */

  const shadowBox = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  const toWindow = (w, g) =>
    `translate(${w.left - rect.left - g}px, ${w.top - rect.top - g}px) scale(${(w.width + 2 * g) / rect.width}, ${(w.height + 2 * g) / rect.height})`;
  const shadowTransform = isOpen ? toWindow(openRect, 0) : peeking ? toWindow(rect, grow) : "none";
  const shadowTransition = reduced ? "none" : `transform ${move}, opacity 350ms ease`;

  /* ---------- light ---------- */

  const filter = peeking ? "brightness(1.12)" : "none";
  const filterTransition = reduced ? "none" : "filter 420ms var(--ease-out)";

  const onFocus = (e) => {
    if (!restoringFocus.current && e.target.matches(":focus-visible")) onPeek("focus");
  };

  const plateStyle = stacked
    ? {
        left: "var(--pad)",
        right: "var(--pad)",
        top: openRect.top + headerHeight + 46,
        bottom: world.height - openRect.top - openRect.height + 12,
      }
    : { left: `calc(${column.left}px + var(--pad))`, right: "var(--pad)", top: "calc(var(--pad) + 52px)", bottom: "var(--pad)" };

  const closeStyle = stacked
    ? { top: `calc(${openRect.top}px + var(--pad) - 4px)`, right: "calc(var(--pad) - 4px)" }
    : { top: "calc(var(--pad) - 4px)", right: "calc(var(--pad) - 4px)" };

  return (
    <section
      ref={sectionRef}
      className={`sheet group ${isOpen ? "is-open" : ""} ${peeking ? "is-peek" : ""} ${closing ? "is-closing" : ""}`}
      data-state={state}
      role={isOpen ? "dialog" : undefined}
      aria-modal={isOpen || undefined}
      aria-label={label}
      style={{ zIndex, opacity: groupOpacity, transform: groupTransform, transition: groupTransition }}
    >
      {/* Same card shadow as the original grid; on hover a deeper one lifts the layer off its neighbours */}
      <div className="sheet-shadow" aria-hidden="true" style={{ ...shadowBox, opacity: split ? 1 : 0, transform: shadowTransform, transition: shadowTransition }} />
      <div className="sheet-shadow is-lift" aria-hidden="true" style={{ ...shadowBox, opacity: peeking || isOpen ? 1 : 0, transform: shadowTransform, transition: shadowTransition }} />

      <div
        className={`sheet-layer ${peekVia === "focus" ? "is-focus" : ""}`}
        style={{ clipPath: outerClip, transition: clipTransition }}
        onPointerEnter={(e) => e.pointerType === "mouse" && revealed && onPeek("hover")}
        onPointerLeave={(e) => e.pointerType === "mouse" && onPeek(null)}
      >
        <div className="sheet-ring" aria-hidden="true" />
        <div className="sheet-inner" style={{ clipPath: innerClip, transition: clipTransition }}>
          {/* The whole photo, registered to the frame: every layer holds the same image */}
          <img
            src={photo}
            alt=""
            aria-hidden="true"
            draggable={false}
            onLoad={() => setPhotoLoaded(true)}
            className={`photo transition-opacity duration-700 ${photoLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ filter, transition: `opacity 700ms ease, ${filterTransition === "none" ? "filter 0s" : filterTransition}` }}
          />
          {/* Flashlight: off on an open layer, where the reading light takes over */}
          <div className="spotlight" style={{ opacity: revealed && !isOpen ? 1 : 0 }} />
          <div className="spotlight-glow" style={{ opacity: revealed && !isOpen ? 1 : 0 }} />
          <p
            className="absolute select-none text-[10px] italic text-white/50"
            style={{
              bottom: "calc(var(--credit-inset) + 6px)",
              right: "calc(var(--credit-inset) + 24px)",
              // On phones an open layer's text scrolls over this spot
              opacity: stacked && isOpen ? 0 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            © Emilia Sipola. All rights reserved.
          </p>

          {/* Collapsed scrim sits on the cell; the reading scrim covers the opened layer */}
          <div aria-hidden="true" className="absolute" style={{ ...shadowBox, background: SCRIM, opacity: split && !isOpen ? 1 : 0, transition: `opacity ${MOVE}` }} />
          <div aria-hidden="true" className="open-scrim" />

          {/* The card: title and hint, exactly as the grid shows them. It rides the window's corner when opened */}
          <div
            className="card-box"
            style={{ ...shadowBox, transform: cornerShift, transition: reduced ? "none" : `transform ${move}` }}
          >
            <div
              className="pointer-events-none absolute inset-0 z-20 flex flex-col p-5 xl:p-6"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "none" : "translateY(8px)",
                transition: `opacity 0.8s ease ${order * 110}ms, transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) ${order * 110}ms`,
              }}
            >
              <header ref={headerRef} className="flex items-start justify-between gap-3">
                <div id={titleId} className="min-w-0">{title}</div>
                <FiArrowUpRight
                  aria-hidden="true"
                  className={`card-arrow shrink-0 text-xl text-accent transition-all duration-200 ${peeking ? "translate-x-0.5 -translate-y-0.5 opacity-100" : "opacity-0"}`}
                />
              </header>

              {hint && (
                <div className="card-hint relative mt-3 min-h-0 flex-1">
                  <div className="absolute inset-0">{hint}</div>
                </div>
              )}
            </div>
          </div>

          {/* Opened content: the right half of the grid (a single column on phones) */}
          <div
            ref={plateRef}
            onScroll={(e) => measure(e.currentTarget)}
            className={`plate ${edges.above ? "fade-above" : ""} ${edges.below ? "fade-below" : ""}`}
            style={plateStyle}
            aria-hidden={!isOpen || undefined}
          >
            <div className="plate-inner">{children}</div>
          </div>
          {!stacked && <div className="plate-spine" aria-hidden="true" style={{ left: column.left - 0.5 }} />}

          {!isOpen && (
            <button
              ref={openRef}
              type="button"
              className="sheet-open"
              onClick={onOpen}
              onFocus={onFocus}
              onBlur={() => onPeek(null)}
              aria-label={`Open ${label}`}
              aria-haspopup="dialog"
              style={{ ...shadowBox, borderRadius: 16, zIndex: count + 20 }}
            />
          )}

          {isOpen && (
            <div className="sheet-close" style={closeStyle}>
              {!stacked && <kbd aria-hidden="true">Esc</kbd>}
              <button ref={closeRef} type="button" onClick={onClose} aria-label={`Close ${label}`}>
                <FiX aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Sheet;
