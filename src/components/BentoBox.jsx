import React, { useState } from "react";
import Overview from "./Overview";
import Projects from "./Projects";
import Contact from "./Contact";
import Cv from "./Cv";
import Tech from "./Tech";

function BentoBox() {
  const [expanded, setExpanded] = useState(null);

  const handleExpand = (boxName) => setExpanded(boxName);
  const handleClose = () => setExpanded(null);

  return (
    <div className="relative grid h-full w-full grid-cols-4 grid-rows-3 gap-3 xl:m-64 lg:m-32 md:m-16 p-10">
      <Overview
        expanded={expanded === "overview"}
        onExpand={() => handleExpand("overview")}
        onClose={handleClose}
      />

      <Projects
        expanded={expanded === "projects"}
        onExpand={() => handleExpand("projects")}
        onClose={handleClose}
      />

      <Contact
        expanded={expanded === "contact"}
        onExpand={() => handleExpand("contact")}
        onClose={handleClose}
      />

      <Cv
        expanded={expanded === "cv"}
        onExpand={() => handleExpand("cv")}
        onClose={handleClose}
      />

      <Tech
        expanded={expanded === "tech"}
        onExpand={() => handleExpand("tech")}
        onClose={handleClose}
      />
    </div>
  );
}

export default BentoBox;
