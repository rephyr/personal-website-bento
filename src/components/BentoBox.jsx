import React, { useState, useRef, useEffect } from "react";
import Overview from "./Overview";
import Projects from "./Projects";
import Contact from "./Contact";
import Cv from "./Cv";
import Tech from "./Tech";
import photo from "../assets/background.webp";

const GAP = 14;
const PHI = 0.618;
const SPOT_RADIUS = "300px";

// Intro timing (ms): photo shows whole, then splits into cards, then text arrives
const WHOLE_FOR = 1100;
const SPLIT_FOR = 800;

const CARDS = [
  { id: "overview", component: Overview },
  { id: "projects", component: Projects },
  { id: "contact",  component: Contact },
  { id: "cv",       component: Cv },
  { id: "tech",     component: Tech },
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

function BentoBox({ stacked }) {
  const [expanded, setExpanded] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const worldRef = useRef(null);
  const pointerInside = useRef(false);
  const [containerSize, setContainerSize] = useState({ width: 900, height: 600 });

  // "whole" → one seamless photo, "split" → gaps open, "done" → text and flashlight on
  const [intro, setIntro] = useState(() => (prefersReducedMotion() ? "done" : "whole"));
  const [photoReady, setPhotoReady] = useState(false);

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

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

  // Flashlight: the world tracks the pointer in CSS vars that every card's photo layer masks against
  const setSpot = (vars) => setVars(worldRef.current, vars);

  useEffect(() => {
    setVars(worldRef.current, { "--spot-r": pointerInside.current && !expanded ? SPOT_RADIUS : "0px" });
  }, [expanded]);

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = worldRef.current.getBoundingClientRect();
    setSpot({ "--spot-x": `${e.clientX - r.left}px`, "--spot-y": `${e.clientY - r.top}px` });
    if (!pointerInside.current) {
      pointerInside.current = true;
      if (!expanded) setSpot({ "--spot-r": SPOT_RADIUS });
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

  // An expanded card fills whatever part of the world is currently scrolled into view
  const viewport = { top: scrollTop, left: 0, width: W, height: H };

  const expand = (id) => {
    setScrollTop(containerRef.current.scrollTop);
    setExpanded(id);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${stacked && !expanded ? "overflow-y-auto" : "overflow-hidden"}`}
      style={stacked ? { scrollbarGutter: "stable" } : undefined}
    >
      <div
        ref={worldRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="spotlight-world relative"
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

        {CARDS.map(({ id, component: Component }, order) => (
          <Component
            key={id}
            expanded={expanded === id}
            onExpand={() => expand(id)}
            onClose={() => setExpanded(null)}
            dimmed={!!expanded && expanded !== id}
            rect={rects[id]}
            viewport={viewport}
            world={world}
            split={split}
            revealed={intro === "done"}
            order={order}
          />
        ))}
      </div>
    </div>
  );
}

export default BentoBox;
