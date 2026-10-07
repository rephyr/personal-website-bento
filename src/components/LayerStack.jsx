import { useCallback, useEffect, useRef, useState } from "react";
import Overview from "./Overview";
import Projects from "./Projects";
import Contact from "./Contact";
import Cv from "./Cv";
import Tech from "./Tech";
import photo from "../assets/background.webp";
// The same photo, small, blurred and darkened: the backdrop behind opened text on phones
import photoSoft from "../assets/background-soft.webp";

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
// Around the flashlight the photo dims a little, only while the pointer is on the board
const LIGHT_ON = { "--spot-r": SPOT_RADIUS, "--spot-dim": "0.3" };
const LIGHT_OFF = { "--spot-r": "0px", "--spot-dim": "0" };

// Intro timing (ms): photo shows whole, then splits into cards, then text arrives
const WHOLE_FOR = 800;
const SPLIT_FOR = 900;
// Then the photo is cut: the gutters open one after another along the golden-ratio divides,
// largest first (ms after the split). Phones and tablets open theirs together.
const CUTS = [["c1", 60], ["r1", 200], ["r2", 340], ["c2", 480]];
// A returning visitor (same tab session) gets the cards straight away
const SEEN_KEY = "intro-seen";
const RETURN_FOR = 120;
// The order the cards' text arrives in once the photo is cut; Projects comes last
const REVEAL_ORDER = ["overview", "contact", "cv", "tech", "projects"];

// The photo (background.webp) and where its subject, the bird, sits in it
const PHOTO = { width: 2560, height: 1707, birdX: 0.355, birdY: 0.552 };

const CARDS = [
  { id: "overview", Component: Overview },
  { id: "projects", Component: Projects },
  { id: "contact",  Component: Contact },
  { id: "cv",       Component: Cv },
  { id: "tech",     Component: Tech },
];

// Desktop: golden-ratio bento filling the frame. `g` is each divide's gutter, so the intro
// can open them one at a time: c1 left|right, r1 overview/projects, r2 contact+cv/tech, c2 contact|cv
function gridLayout(W, H, g) {
  const col1 = W * 0.5;               // left / right divide
  const col2 = W * (0.5 + 0.5 * PHI); // contact / cv divide inside right half
  const row1 = H * (1 - PHI);         // overview / projects divide (~38%)
  const row2 = H * PHI;               // contact+cv / tech divide (~62%)
  const right = col1 + g.c1 / 2;      // where the right half starts

  return {
    world: { width: W, height: H },
    rects: {
      overview: { top: 0,              left: 0,               width: col1 - g.c1 / 2,             height: row1 - g.r1 / 2     },
      projects: { top: row1 + g.r1 / 2, left: 0,              width: col1 - g.c1 / 2,             height: H - row1 - g.r1 / 2 },
      contact:  { top: 0,              left: right,           width: col2 - g.c2 / 2 - right,     height: row2 - g.r2 / 2     },
      cv:       { top: 0,              left: col2 + g.c2 / 2, width: W - col2 - g.c2 / 2,         height: row2 - g.r2 / 2     },
      tech:     { top: row2 + g.r2 / 2, left: right,          width: W - right,                   height: H - row2 - g.r2 / 2 },
    },
  };
}

// Phones: one scrolling column. Tablets in portrait and landscape phones: two columns.
// Row heights are sized to each card's collapsed content, and stretch to fill a taller screen.
// `bird` is the card the photo is framed to put the bird in, clear of the text.
const STACKS = {
  one: {
    rows: [[["overview"], 236], [["projects"], 230], [["contact"], 220], [["cv"], 240], [["tech"], 180]],
    bird: { id: "contact", x: 0.76, y: 0.44 },
  },
  two: {
    rows: [[["overview"], 230], [["projects", "cv"], 270], [["contact", "tech"], 210]],
    bird: { id: "cv", x: 0.66, y: 0.52 },
  },
};

function stackedLayout(W, H, gap) {
  const stack = W >= 600 ? STACKS.two : STACKS.one;
  const natural = stack.rows.reduce((sum, [, h]) => sum + h, 0);
  const gaps = gap * (stack.rows.length + 1);
  const stretch = Math.max(1, (H - gaps) / natural);
  const rects = {};
  let top = gap;
  for (const [ids, h] of stack.rows) {
    const height = Math.floor(h * stretch);
    const width = (W - gap * (ids.length + 1)) / ids.length;
    ids.forEach((id, i) => {
      rects[id] = { top, left: gap + i * (width + gap), width, height };
    });
    top += height + gap;
  }
  return { world: { width: W, height: Math.max(top, H) }, rects, bird: stack.bird };
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Where the photo sits in the world. Like object-fit: cover, but on phones it's framed (and
// zoomed a touch if it has to be) so the bird lands inside a card instead of off-screen
function photoBoxFor(world, target) {
  const { width: W, height: H } = world;
  const cover = Math.max(W / PHOTO.width, H / PHOTO.height);
  let scale = cover;
  let tx = W / 2 + (PHOTO.birdX - 0.5) * PHOTO.width * cover;
  let ty = H / 2 + (PHOTO.birdY - 0.5) * PHOTO.height * cover;
  if (target) {
    tx = target.x;
    ty = target.y;
    const needed = Math.max(
      tx / (PHOTO.birdX * PHOTO.width),
      (W - tx) / ((1 - PHOTO.birdX) * PHOTO.width),
      ty / (PHOTO.birdY * PHOTO.height),
      (H - ty) / ((1 - PHOTO.birdY) * PHOTO.height),
    );
    scale = clamp(needed, cover, cover * 1.3);
  }
  const width = PHOTO.width * scale;
  const height = PHOTO.height * scale;
  return {
    left: clamp(tx - PHOTO.birdX * width, W - width, 0),
    top: clamp(ty - PHOTO.birdY * height, H - height, 0),
    width,
    height,
  };
}

function introSeen() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
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
  const returning = useRef(introSeen()).current;
  const [intro, setIntro] = useState(() => (reduced ? "done" : returning ? "split" : "whole"));
  const [photoReady, setPhotoReady] = useState(false);
  const split = intro !== "whole";
  // How many of the grid's divides have been cut open
  const [cuts, setCuts] = useState(() => (reduced || returning ? CUTS.length : 0));
  useEffect(() => {
    if (!split) return;
    const timers = CUTS.map(([, at], i) => setTimeout(() => setCuts((c) => Math.max(c, i + 1)), at));
    return () => timers.forEach(clearTimeout);
  }, [split]);

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
    if (returning) {
      const toDone = setTimeout(() => setIntro("done"), RETURN_FOR);
      return () => clearTimeout(toDone);
    }
    const toSplit = setTimeout(() => setIntro((s) => (s === "whole" ? "split" : s)), WHOLE_FOR);
    const toDone = setTimeout(() => setIntro("done"), WHOLE_FOR + SPLIT_FOR);
    return () => { clearTimeout(toSplit); clearTimeout(toDone); };
  }, [photoReady, returning]);

  useEffect(() => {
    if (intro !== "done") return;
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage can be blocked; the intro just plays again next time
    }
  }, [intro]);

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

  // The flashlight only switches on while the pointer is over the board
  useEffect(() => {
    setVars(worldRef.current, pointerInside.current && !openId ? LIGHT_ON : LIGHT_OFF);
  }, [openId]);

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = worldRef.current.getBoundingClientRect();
    setSpot({ "--spot-x": `${e.clientX - r.left}px`, "--spot-y": `${e.clientY - r.top}px` });
    if (!pointerInside.current) {
      pointerInside.current = true;
      if (!openId) setSpot(LIGHT_ON);
    }
  };

  const onPointerLeave = () => {
    pointerInside.current = false;
    setSpot(LIGHT_OFF);
  };

  const gap = split ? GAP : 0;
  const cutGaps = Object.fromEntries(CUTS.map(([divide], i) => [divide, split && cuts > i ? GAP : 0]));
  // Every divide open: corners round, shadows and scrims come in (earlier, they'd give the
  // uncut seams away)
  const settled = stacked ? split : cuts >= CUTS.length;
  const { width: W, height: H } = containerSize;
  const { world, rects, bird } = stacked ? stackedLayout(W, H, gap) : gridLayout(W, H, cutGaps);
  const birdRect = bird && rects[bird.id];
  const photoBox = photoBoxFor(
    world,
    birdRect && { x: birdRect.left + birdRect.width * bird.x, y: birdRect.top + birdRect.height * bird.y },
  );

  // Where an open layer's window ends up: the whole frame, or on phones whatever part of
  // the column is scrolled into view
  const openRect = stacked
    ? { top: scrollTop, left: 0, width: W, height: H }
    : { top: 0, left: 0, width: W, height: H };

  // Opened content always sits in the right half of the golden-ratio grid, clear of the bird
  const column = stacked ? null : { left: W * 0.5 + GAP / 2 };

  const stateOf = (id) => {
    if (openId) return openId === id ? "open" : "dim";
    // A pointer on one of a card's own links: the card doesn't lift (the link is the action),
    // but it's still the card in play, so the others stay shaded
    if (peek) return peek.id === id ? (peek.via === "link" ? "rest" : "peek") : "shade";
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
            className="photo"
            style={{
              ...photoBox,
              // The layers take over (identical, so unseen) and this steps away quickly, so each
              // cut opens onto the dark behind rather than onto more photo
              opacity: photoReady && !split ? 1 : 0,
              transition: split ? "opacity 0.3s ease" : "opacity 1s ease",
            }}
          />
        )}

        {CARDS.map(({ id, Component }) => (
          <Component
            key={id}
            sheet={{
              id,
              order: REVEAL_ORDER.indexOf(id),
              count: CARDS.length,
              rect: rects[id],
              world,
              openRect,
              column,
              stacked,
              radius: settled ? RADIUS : 0,
              settled,
              photoBox,
              photoSoft,
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
