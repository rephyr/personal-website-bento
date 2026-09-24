import { useEffect, useState } from "react";
import BentoBox from "./components/BentoBox";

// Phones and short landscape screens get a single scrolling column
const STACKED_QUERY = "(max-width: 767px), (max-height: 499px)";

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

  // Desktop: 3:2 frame that fits the window, capped so text doesn't drown on big screens
  const frame = stacked
    ? { width: "100%", height: "100%" }
    : { width: "min(92vw, calc(92vh * 1.5), 1400px)", height: "min(92vh, calc(92vw / 1.5), 933px)" };

  return (
    <main className="h-dvh w-full flex items-center justify-center bg-neutral-950">
      <div style={frame}>
        <BentoBox stacked={stacked} />
      </div>
    </main>
  );
}

export default App;
