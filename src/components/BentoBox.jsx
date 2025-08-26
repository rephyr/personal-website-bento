import React, { useState } from "react";
import Overview from "./Overview";
import Projects from "./Projects";
import Contact from "./Contact";
import Cv from "./Cv";
import Tech from "./Tech";

function BentoBox() {
  const [expanded, setExpanded] = useState(null);

  const containerRect = { width: 900, height: 600 };

  const padding = 5; 

  const boxes = [
    { id: "overview", rect: { top: 0, left: 0, width: 450 - padding, height: 150 - padding }, component: Overview },
    { id: "projects", rect: { top: 150 + padding, left: 0, width: 450 - padding, height: 450 - padding }, component: Projects },
    { id: "contact", rect: { top: 0, left: 450 + padding, width: 220 - padding, height: 450 - padding }, component: Contact },
    { id: "cv", rect: { top: 0, left: 675 + padding, width: 225 - padding, height: 450 - padding }, component: Cv },
    { id: "tech", rect: { top: 450 + padding, left: 450 + padding, width: 450 - padding, height: 150 - padding }, component: Tech },
  ];

  return (
    <div className="relative" style={{ width: containerRect.width, height: containerRect.height }}>
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
