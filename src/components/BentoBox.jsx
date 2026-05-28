import React, { useState, useRef, useEffect } from "react";
import Overview from "./Overview";
import Projects from "./Projects";
import Contact from "./Contact";
import Cv from "./Cv";
import Tech from "./Tech";

function BentoBox() {
  const [expanded, setExpanded] = useState(null);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 900, height: 600 });

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const { width: W, height: H } = containerSize;
  const gap = 5;
  const phi = 0.618;

  const containerRect = { width: W, height: H };

  // Golden ratio splits
  const col1 = W * 0.5;               // left / right divide
  const col2 = W * (0.5 + 0.5 * phi); // contact / cv divide inside right half
  const row1 = H * (1 - phi);          // overview / projects divide (~38%)
  const row2 = H * phi;                // contact+cv / tech divide (~62%)

  const boxes = [
    { id: "overview",  component: Overview,  rect: { top: 0,         left: 0,        width: col1-gap,        height: row1-gap      } },
    { id: "projects",  component: Projects,  rect: { top: row1+gap,  left: 0,        width: col1-gap,        height: H-row1-gap    } },
    { id: "contact",   component: Contact,   rect: { top: 0,         left: col1+gap, width: col2-col1-2*gap, height: row2-gap      } },
    { id: "cv",        component: Cv,        rect: { top: 0,         left: col2+gap, width: W-col2-gap,      height: row2-gap      } },
    { id: "tech",      component: Tech,      rect: { top: row2+gap,  left: col1+gap, width: W-col1-gap,      height: H-row2-gap    } },
  ];

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {boxes.map(({ id, rect, component: Component }) => (
        <Component
          key={id}
          expanded={expanded === id}
          onExpand={() => setExpanded(id)}
          onClose={() => setExpanded(null)}
          dimmed={!!expanded && expanded !== id}
          rect={rect}
          containerRect={containerRect}
        />
      ))}
    </div>
  );
}

export default BentoBox;
