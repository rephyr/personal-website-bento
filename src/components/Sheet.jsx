import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";

// Intro: each cut opens decisively and lands softly
const MOVE = "0.56s cubic-bezier(0.5, 0, 0.1, 1)";

// Durations (ms); the curves live in index.css
const OPEN = 700;
const CLOSE = 560;
const PEEK = 5; // how far a hovered layer lifts out past its cell: a little, so the gutter survives

const px = (n) => `${n}px`;

/*
  One set of numbers moves everything. The window (clip-path), its shadow, the card's scrim,
  its edge ring and the title all read the same registered custom properties (index.css), so
  they're sampled on the same thread in the same frame and can't drift apart mid-transition.

  --wt/--wr/--wb/--wl  the window's insets from the world's edges (its cell, or the open frame)
  --gt/--gr/--gb/--gl  how far the window lifts out past each side on hover
  --wround             corner radius
*/
const WINDOW_VARS = ["--wt", "--wr", "--wb", "--wl", "--wround"];
const GROW_VARS = ["--gt", "--gr", "--gb", "--gl"];

// Wrap blocks of opened content in this: they develop in one after another
export function Develop({ i = 0, as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag className={`develop ${className}`} style={{ "--i": i }} {...rest}>
      {children}
    </Tag>
  );
}

function Sheet({ sheet, label, title, hint, index, foot, children }) {
  const {
    order, count, rect, world, openRect, column, stacked, radius, photoBox,
    state, peekVia, split, settled, revealed, reduced, photo, photoSoft, onOpen, onClose, onPeek,
  } = sheet;
  const isOpen = state === "open";
  const peeking = state === "peek";
  const titleId = useId();

  const sectionRef = useRef(null);
  const openRef = useRef(null);
  const closeRef = useRef(null);
  const headerRef = useRef(null);
  const plateRef = useRef(null);
  const footRef = useRef(null);
  const hintRef = useRef(null);
  const [photoLoaded, setPhotoLoaded] = useState(false);

  // Layers under an open one can't be reached
  const unreachable = state === "dim";
  useEffect(() => {
    if (sectionRef.current) sectionRef.current.inert = unreachable;
  }, [unreachable]);

  // The card's own shortcuts (download, email) belong to the collapsed card only
  const footLive = revealed && !isOpen;
  useEffect(() => {
    if (footRef.current) footRef.current.inert = !footLive;
    if (hintRef.current) hintRef.current.inert = !footLive;
  }, [footLive]);

  // Tab stays inside an open layer, wrapping from the last stop back to the close button
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key !== "Tab" || !sectionRef.current) return;
      const stops = [...sectionRef.current.querySelectorAll("a[href], button, [tabindex]")].filter(
        (el) => el.tabIndex >= 0 && !el.closest("[inert], [aria-hidden='true']") && el.getClientRects().length > 0,
      );
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      const inside = sectionRef.current.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

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

  /* ---------- the opened column: soft edges and the index ---------- */

  // Fade the bottom while there's more, the top once scrolled; and note which of the
  // index's sections are on screen, so the index can say where the reader is
  const [edges, setEdges] = useState({ above: false, below: false });
  const [inView, setInView] = useState("");
  const hasIndex = !!index;
  const measure = useCallback((el) => {
    if (!el) return;
    const above = el.scrollTop > 4;
    const below = el.scrollTop + el.clientHeight < el.scrollHeight - 4;
    setEdges((s) => (s.above === above && s.below === below ? s : { above, below }));
    if (!hasIndex) return;
    const box = el.getBoundingClientRect();
    const sections = [...el.querySelectorAll("[data-section]")];
    // Scrolled all the way down, most of the list is on screen at once: point at where the
    // reader landed (the last section) instead of lighting everything
    if (above && !below && el.scrollHeight > el.clientHeight + 4) {
      setInView(sections.at(-1)?.dataset.section ?? "");
      return;
    }
    const keys = [];
    sections.forEach((section) => {
      const r = section.getBoundingClientRect();
      const visible = Math.min(box.bottom, r.bottom) - Math.max(box.top, r.top);
      if (visible >= Math.min(140, r.height * 0.6)) keys.push(section.dataset.section);
    });
    setInView(keys.join(" "));
  }, [hasIndex]);
  useEffect(() => {
    if (!isOpen) {
      setEdges({ above: false, below: false });
      setInView("");
      return;
    }
    const t = setTimeout(() => measure(plateRef.current), reduced ? 250 : OPEN + 250);
    return () => clearTimeout(t);
  }, [isOpen, reduced, world.width, world.height, measure]);

  // Touch screens have no hover to develop the project shots into colour: each one develops
  // once it has scrolled into view in the opened column (index.css, .is-seen)
  useEffect(() => {
    const plate = plateRef.current;
    if (!isOpen || !plate || !window.matchMedia("(hover: none)").matches) return;
    let io;
    const start = setTimeout(() => {
      io = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.closest("[data-section]")?.classList.add("is-seen");
          io.unobserve(entry.target);
        }),
        { root: plate, threshold: 0.6 },
      );
      plate.querySelectorAll(".project-shot").forEach((img) => io.observe(img));
    }, reduced ? 0 : OPEN);
    return () => {
      clearTimeout(start);
      io?.disconnect();
      plate.querySelectorAll(".is-seen").forEach((el) => el.classList.remove("is-seen"));
    };
  }, [isOpen, reduced]);

  const flashTimer = useRef(null);
  useEffect(() => () => clearTimeout(flashTimer.current), []);
  const jumpTo = (key) => {
    const plate = plateRef.current;
    const target = plate?.querySelector(`[data-section="${key}"]`);
    if (!target) return;
    const top = target.getBoundingClientRect().top - plate.getBoundingClientRect().top + plate.scrollTop;
    plate.scrollTo({ top: Math.max(0, top - 2), behavior: reduced ? "auto" : "smooth" });
    target.focus({ preventScroll: true });
    // Mark where the jump landed, which matters most when everything already fits on screen
    plate.querySelectorAll(".is-target").forEach((el) => el.classList.remove("is-target"));
    target.classList.add("is-target");
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => target.classList.remove("is-target"), 1400);
  };
  const shown = new Set(inView.split(" "));
  const indexLive = isOpen && !stacked;

  /* ---------- the window ---------- */

  const win = isOpen ? openRect : rect;
  // On a hover the cell lifts out a few px, except on sides that meet the frame's edge,
  // where the frame would crop the lift (and its round corner)
  const lift = peeking ? PEEK : 0;
  const rightGap = world.width - rect.left - rect.width;
  const bottomGap = world.height - rect.top - rect.height;
  const geometry = {
    "--wt": px(win.top),
    "--wr": px(world.width - win.left - win.width),
    "--wb": px(world.height - win.top - win.height),
    "--wl": px(win.left),
    "--wround": px(isOpen ? 16 : radius),
    "--gt": px(rect.top > 1 ? lift : 0),
    "--gr": px(rightGap > 1 ? lift : 0),
    "--gb": px(bottomGap > 1 ? lift : 0),
    "--gl": px(rect.left > 1 ? lift : 0),
  };

  let move;
  if (!revealed) move = MOVE;
  else if (isOpen) move = `${OPEN}ms var(--ease-reveal)`;
  else if (from === "open") move = `${CLOSE}ms var(--ease-reveal) 40ms`;
  else move = "420ms var(--ease-out)";

  /* ---------- the layer as a whole ---------- */

  const onTop = isOpen || closing || from === "open";
  const zIndex = onTop ? 40 : peeking ? 30 : 10;
  // Hidden until the intro splits the photo; identical to the photo underneath, so it appears seamlessly
  const groupOpacity = !split ? 0 : state === "dim" ? (stacked ? 0.3 : 0.4) : state === "shade" ? 0.84 : 1;
  const groupTransform = state === "dim" && !stacked ? "scale(0.985)" : "none";
  let groupTransition;
  if (reduced) groupTransition = "opacity 200ms ease";
  // Intro: the layers replace the whole photo in one frame (they're identical to it)
  else if (!revealed) groupTransition = "opacity 0s";
  else if (state === "dim") groupTransition = "opacity 500ms ease, transform 700ms var(--ease-reveal)";
  else if (from === "dim") groupTransition = "opacity 400ms ease 200ms, transform 600ms var(--ease-out) 100ms";
  else groupTransition = "opacity 350ms ease";

  const transition = reduced
    ? groupTransition
    : [
        ...WINDOW_VARS.map((v) => `${v} ${move}`),
        ...GROW_VARS.map((v) => `${v} 420ms var(--ease-out)`),
        groupTransition,
      ].join(", ");

  // The card's scrim rides the window; it clears before the reading light takes over, and
  // returns once the window is nearly home
  let scrimTransition;
  if (reduced) scrimTransition = "opacity 200ms ease";
  else if (!revealed) scrimTransition = `opacity ${MOVE}`;
  else if (isOpen) scrimTransition = "opacity 320ms ease";
  else if (from === "open") scrimTransition = `opacity 360ms ease ${CLOSE * 0.45}ms`;
  else scrimTransition = "opacity 350ms ease";

  const cellBox = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  // The title block rides the window's top-left corner, so it lands top-left when opened
  const cornerShift = `translate3d(calc(var(--wl) - ${px(rect.left)}), calc(var(--wt) - ${px(rect.top)}), 0)`;

  /* ---------- light ---------- */

  const filter = peeking ? "brightness(1.12)" : "none";
  const filterTransition = reduced ? "filter 0s" : "filter 420ms var(--ease-out)";
  // Phones, where the text runs over the photo: an opened layer cross-fades to a soft,
  // pre-blurred copy, so the bird is only atmosphere behind the words (no live blur filter)
  const soft = isOpen && stacked;
  const softTransition = reduced ? "opacity 200ms ease" : soft ? `opacity ${OPEN}ms ease 150ms` : `opacity ${CLOSE}ms ease`;

  // Hovering one of the card's own links shouldn't also light up the card as a whole (two
  // "click me" signals for two different actions). The link list and each foot link count as
  // one zone, gaps included; the card is still the one being pointed at ("link"), so its
  // neighbours stay shaded. Switching between card and zone settles after a beat, so a pointer
  // skimming the edge of the zone doesn't make the card flicker.
  const hoverTimer = useRef(null);
  const pending = useRef(null);
  const cancelPending = () => {
    clearTimeout(hoverTimer.current);
    pending.current = null;
  };
  useEffect(() => () => clearTimeout(hoverTimer.current), []);
  const onPointerOver = (e) => {
    if (e.pointerType !== "mouse" || !revealed) return;
    const want = e.target.closest?.(".link-zone, .card-foot a") ? "link" : "hover";
    const current = peekVia === "hover" || peekVia === "link" ? peekVia : null;
    if (want === current) {
      cancelPending();
      return;
    }
    if (want === pending.current) return; // already on its way
    cancelPending();
    // Arriving on the card from outside answers at once; changing zones within it waits
    if (!current) {
      onPeek(want);
      return;
    }
    pending.current = want;
    hoverTimer.current = setTimeout(() => {
      pending.current = null;
      onPeek(want);
    }, 120);
  };
  const onPointerLeave = (e) => {
    if (e.pointerType !== "mouse") return;
    cancelPending();
    onPeek(null);
  };

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
      className={`sheet group ${foot ? "has-foot" : ""} ${isOpen ? "is-open" : ""} ${peeking ? "is-peek" : ""} ${closing ? "is-closing" : ""}`}
      data-state={state}
      role={isOpen ? "dialog" : undefined}
      aria-modal={isOpen || undefined}
      aria-label={label}
      style={{ ...geometry, zIndex, opacity: groupOpacity, transform: groupTransform, transition }}
    >
      {/* Card shadow, and a deeper one for a lifted or opened layer. Both are the window's own box */}
      <div className="sheet-shadow win" aria-hidden="true" style={{ opacity: settled ? 1 : 0 }} />
      <div className="sheet-shadow is-lift win" aria-hidden="true" style={{ opacity: peeking || isOpen ? 1 : 0 }} />

      <div
        className={`sheet-layer ${peekVia === "focus" ? "is-focus" : ""}`}
        onPointerOver={onPointerOver}
        onPointerLeave={onPointerLeave}
      >
        <div className="sheet-inner">
          {/* The whole photo, registered to the frame: every layer holds the same image */}
          <img
            src={photo}
            alt=""
            aria-hidden="true"
            draggable={false}
            onLoad={() => setPhotoLoaded(true)}
            className="photo"
            style={{
              ...photoBox,
              filter,
              opacity: photoLoaded ? 1 : 0,
              transition: `opacity 700ms ease, ${filterTransition}`,
            }}
          />
          {stacked && (
            <img
              src={photoSoft}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="photo"
              style={{ ...photoBox, opacity: soft ? 1 : 0, transition: softTransition }}
            />
          )}
          {/* Flashlight: off on an open layer, where the reading light takes over */}
          <div className="spotlight" style={{ opacity: revealed && !isOpen ? 1 : 0 }} />
          <div className="spotlight-glow" style={{ opacity: revealed && !isOpen ? 1 : 0 }} />

          {/* Collapsed scrim rides the window; the reading scrim covers the opened layer */}
          <div aria-hidden="true" className="card-scrim win" style={{ opacity: settled && !isOpen ? 1 : 0, transition: scrimTransition }} />
          <div aria-hidden="true" className="open-scrim" />

          <p
            className="photo-credit"
            style={{
              // An open layer's text column runs over this spot
              opacity: isOpen ? 0 : 1,
              transition: isOpen ? "opacity 0.2s ease" : "opacity 0.4s ease 0.3s",
            }}
          >
            © Emilia Sipola. All rights reserved.
          </p>

          {/* The card's button comes first, so the card's own links tab after it */}
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
              style={{ ...cellBox, borderRadius: 16, zIndex: count + 20 }}
            />
          )}

          {/* Open: the close control is the dialog's first stop, ahead of the index and the text */}
          {isOpen && (
            <div className="sheet-close" style={closeStyle}>
              {!stacked && <kbd aria-hidden="true">Esc</kbd>}
              <button ref={closeRef} type="button" onClick={onClose} aria-label={`Close ${label}`}>
                <FiX aria-hidden="true" />
              </button>
            </div>
          )}

          {/* The card: title and hint, exactly as the grid shows them. It rides the window's corner when opened */}
          <div className="card-box" style={{ ...cellBox, transform: cornerShift }}>
            <div
              className="card-text pointer-events-none absolute inset-0 flex flex-col"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "none" : "translateY(8px)",
                transition: `opacity 0.8s ease ${order * 110}ms, transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) ${order * 110}ms`,
              }}
            >
              <header ref={headerRef} className="flex items-start justify-between gap-3">
                <div id={titleId} className="min-w-0">{title}</div>
                <FiArrowUpRight aria-hidden="true" className="card-arrow" />
              </header>

              {index ? (
                <nav className="card-hint is-index" aria-label={`${label} index`} aria-hidden={!indexLive || undefined}>
                  <ul className="type-hint space-y-1.5">
                    {index.map(({ key, label: text, strong }) => (
                      <li key={key}>
                        <button
                          type="button"
                          tabIndex={indexLive ? 0 : -1}
                          onClick={() => jumpTo(key)}
                          className={`index-link ${strong ? "is-strong" : ""} ${shown.has(key) ? "is-current" : ""}`}
                        >
                          {text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : hint ? (
                <div ref={hintRef} className="card-hint">{hint}</div>
              ) : null}
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

          {/* Bottom of the card: a shortcut or a glance */}
          {foot && (
            <div
              ref={footRef}
              className="card-foot"
              style={{
                ...cellBox,
                zIndex: count + 22,
                opacity: footLive ? 1 : 0,
                transition: reduced
                  ? "opacity 200ms ease"
                  : footLive
                    ? `opacity 0.6s ease ${from === "open" ? CLOSE : 200 + order * 110}ms`
                    : "opacity 0.2s ease",
              }}
            >
              {foot}
            </div>
          )}

          {/* Edge light of a lifted layer, drawn just inside the window so the frame never crops it */}
          <div className="sheet-ring win" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default Sheet;
