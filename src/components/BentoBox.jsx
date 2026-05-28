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

  const containerRect = { width: W, height: H };

  const boxes = [
    { id: "overview",  component: Overview,  rect: { top: 0,           left: 0,           width: W/2-gap,     height: H/4-gap     } },
    { id: "projects",  component: Projects,  rect: { top: H/4+gap,     left: 0,           width: W/2-gap,     height: H*3/4-gap   } },
    { id: "contact",   component: Contact,   rect: { top: 0,           left: W/2+gap,     width: W/4-2*gap,   height: H*3/4-gap   } },
    { id: "cv",        component: Cv,        rect: { top: 0,           left: W*3/4+gap,   width: W/4-gap,     height: H*3/4-gap   } },
    { id: "tech",      component: Tech,      rect: { top: H*3/4+gap,   left: W/2+gap,     width: W/2-gap,     height: H/4-gap     } },
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
