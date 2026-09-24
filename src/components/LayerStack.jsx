import { useCallback, useEffect, useRef, useState } from "react";
import Overview from "./Overview";
import Projects from "./Projects";
import Contact from "./Contact";
import Cv from "./Cv";
import Tech from "./Tech";
import photo from "../assets/background.webp";

/*
  The golden-ratio bento, built from layers.

  Every section is a layer the size of the whole frame, holding the whole photo. At rest
  each layer is clipped (clip-path) down to its own golden-ratio cell, so the page looks
  like five cards cut from one photograph. The box is bigger than its window: hover lets
  a layer slide out past its cell, and opening one grows its window to the full frame.
*/

const GAP = 14;
const PHI = 0.618;
const RADIUS = 16;
const SPOT_RADIUS = "300px";

// Intro timing (ms): photo shows whole, then splits into cards, then text arrives
const WHOLE_FOR = 1100;
const SPLIT_FOR = 800;

const CARDS = [
  { id: "overview", Component: Overview },
  { id: "projects", Component: Projects },
  { id: "contact",  Component: Contact },
  { id: "cv",       Component: Cv },
  { id: "tech",     Component: Tech },
];

// Desktop: golden-ratio bento filling the frame
function gridLayout(W, H, gap) {
  const half = gap / 2;
  const col1 = W * 0.5;               // left / right divide
  const col2 = W * (0.5 + 0.5 * PHI); // contact / cv divide inside right half
  const row1 = H * (1 - PHI);         // overview / projects divide (~38%)
  const row2 = H * PHI;               // contact+cv / tech divide (~62%)

  return {
    world: { width: W, height: H },
    rects: {
      overview: { top: 0,           left: 0,           width: col1 - half,       height: row1 - half     },
      projects: { top: row1 + half, left: 0,           width: col1 - half,       height: H - row1 - half },
      contact:  { top: 0,           left: col1 + half, width: col2 - col1 - gap, height: row2 - half     },
      cv:       { top: 0,           left: col2 + half, width: W - col2 - half,   height: row2 - half     },
      tech:     { top: row2 + half, left: col1 + half, width: W - col1 - half,   height: H - row2 - half },
    },
  };
}

// Mobile: one scrolling column, card heights sized to their collapsed content
const STACK = [
  ["overview", 180],
  ["projects", 220],
  ["contact",  140],
  ["cv",       220],
  ["tech",     140],
];

function stackedLayout(W, gap) {
  const width = W - 2 * gap;
  const rects = {};
  let top = gap;
  for (const [id, height] of STACK) {
    rects[id] = { top, left: gap, width, height };
    top += height + gap;
  }
  return { world: { width: W, height: top }, rects };
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setVars(el, vars) {
  for (const [name, value] of Object.entries(vars)) el?.style.setProperty(name, value);
}

function LayerStack({ stacked }) {
  const containerRef = useRef(null);
  const worldRef = useRef(null);
  const pointerInside = useRef(false);
  const [containerSize, setContainerSize] = useState({ width: 900, height: 600 });
  const [openId, setOpenId] = useState(null);
  const [peek, setPeek] = useState(null); // { id, via: "hover" | "focus" }
  const [scrollTop, setScrollTop] = useState(0);
  const [resizing, setResizing] = useState(false);
  const reduced = useRef(prefersReducedMotion()).current;

  // "whole" → one seamless photo, "split" → gaps open, "done" → text and flashlight on
  const [intro, setIntro] = useState(() => (reduced ? "done" : "whole"));
  const [photoReady, setPhotoReady] = useState(false);

  useEffect(() => {
    let timer;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
      // Snap instead of animating the windows while the browser is being resized
      setResizing(true);
      clearTimeout(timer);
      timer = setTimeout(() => setResizing(false), 150);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => { ro.disconnect(); clearTimeout(timer); };
  }, []);

  // Don't start the intro until the photo is decoded, or the split plays over a blank frame
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = photo;
    img.decode().catch(() => {}).then(() => {
      if (!cancelled) setPhotoReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!photoReady) return;
    const toSplit = setTimeout(() => setIntro((s) => (s === "whole" ? "split" : s)), WHOLE_FOR);
    const toDone = setTimeout(() => setIntro("done"), WHOLE_FOR + SPLIT_FOR);
    return () => { clearTimeout(toSplit); clearTimeout(toDone); };
  }, [photoReady]);

  // An open layer is a history entry, so Back (or a phone's back gesture) closes it
  const goingBack = useRef(false);
  useEffect(() => {
    if (window.history.state?.layer) window.history.replaceState(null, "");
    const onPopState = (e) => {
      goingBack.current = false;
      setOpenId(e.state?.layer ?? null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const open = useCallback((id) => {
    setScrollTop(containerRef.current.scrollTop);
    setIntro("done");
    setPeek(null);
    setOpenId(id);
    window.history.pushState({ layer: id }, "");
  }, []);

  const close = useCallback(() => {
    // Only ever step back over our own entry, and only once, so a double Esc can't leave the site
    if (goingBack.current) return;
    if (window.history.state?.layer) {
      goingBack.current = true;
      window.history.back();
    } else {
      setOpenId(null);
    }
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openId, close]);

  // Flashlight: the world tracks the pointer in CSS vars that every layer's photo masks against
  const setSpot = (vars) => setVars(worldRef.current, vars);

  useEffect(() => {
    setVars(worldRef.current, { "--spot-r": pointerInside.current && !openId ? SPOT_RADIUS : "0px" });
  }, [openId]);

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = worldRef.current.getBoundingClientRect();
    setSpot({ "--spot-x": `${e.clientX - r.left}px`, "--spot-y": `${e.clientY - r.top}px` });
    if (!pointerInside.current) {
      pointerInside.current = true;
      if (!openId) setSpot({ "--spot-r": SPOT_RADIUS });
    }
  };

  const onPointerLeave = () => {
    pointerInside.current = false;
    setSpot({ "--spot-r": "0px" });
  };

  const split = intro !== "whole";
  const gap = split ? GAP : 0;
  const { width: W, height: H } = containerSize;
  const { world, rects } = stacked ? stackedLayout(W, gap) : gridLayout(W, H, gap);

  // Where an open layer's window ends up: the whole frame, or on phones whatever part of
  // the column is scrolled into view
  const openRect = stacked
    ? { top: scrollTop, left: 0, width: W, height: H }
    : { top: 0, left: 0, width: W, height: H };

  // Opened content always sits in the right half of the golden-ratio grid, clear of the bird
  const column = stacked ? null : { left: W * 0.5 + GAP / 2 };

  const stateOf = (id) => {
    if (openId) return openId === id ? "open" : "dim";
    if (peek) return peek.id === id ? "peek" : "shade";
    return "rest";
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${stacked && !openId ? "overflow-y-auto" : "overflow-hidden"}`}
      style={stacked ? { scrollbarGutter: "stable" } : undefined}
    >
      <div
        ref={worldRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={`world spotlight-world relative ${resizing ? "is-resizing" : ""} ${reduced ? "is-reduced" : ""}`}
        data-mode={stacked ? "stacked" : "grid"}
        data-intro={intro}
        style={{
          width: world.width,
          height: world.height,
          containerType: "inline-size",
          // On mobile the world has a gap around the cards; keeps the photo credit inside the last card
          "--credit-inset": stacked ? `${gap}px` : "0px",
        }}
      >
        {/* Whole photo shown during the intro; it dissolves out of the gaps as they open */}
        {intro !== "done" && (
          <img
            src={photo}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: photoReady && !split ? 1 : 0,
              transition: split ? "opacity 0.6s ease" : "opacity 1s ease",
            }}
          />
        )}

        {CARDS.map(({ id, Component }, order) => (
          <Component
            key={id}
            sheet={{
              id,
              order,
              count: CARDS.length,
              rect: rects[id],
              world,
              openRect,
              column,
              stacked,
              radius: split ? RADIUS : 0,
              state: stateOf(id),
              peekVia: peek?.id === id ? peek.via : null,
              anyOpen: !!openId,
              split,
              revealed: intro === "done",
              reduced,
              photo,
              onOpen: () => open(id),
              onClose: close,
              onPeek: (via) => setPeek((cur) => (via ? { id, via } : cur?.id === id ? null : cur)),
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default LayerStack;
