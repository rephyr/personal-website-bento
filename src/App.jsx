import { useEffect, useState } from "react";
import LayerStack from "./components/LayerStack";

// Phones, short landscape screens and portrait tablets get a scrolling column layout;
// a 3:2 grid would be letterboxed on a portrait screen
const STACKED_QUERY = "(max-width: 767px), (max-height: 499px), (max-width: 1100px) and (orientation: portrait)";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

function App() {
  const stacked = useMediaQuery(STACKED_QUERY);
  const huge = useMediaQuery("(min-width: 2200px)");

  // Desktop: 3:2 frame that fits the window, capped so text doesn't drown on big screens
  // (a little larger on very big ones, so the board doesn't float small in a black field)
  const cap = huge ? 1680 : 1400;
  const frame = stacked
    ? { width: "100%", height: "100%" }
    : { width: `min(92vw, calc(92vh * 1.5), ${cap}px)`, height: `min(92vh, calc(92vw / 1.5), ${cap / 1.5}px)` };

  return (
    <main className="h-dvh w-full flex items-center justify-center bg-neutral-950">
      <div style={frame}>
        <LayerStack stacked={stacked} />
      </div>
    </main>
  );
}

export default App;
