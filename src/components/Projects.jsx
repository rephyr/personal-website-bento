import React from "react";
import ExpandableCard from "./ExpandableCard";

function Projects(props) {
  return (
    <ExpandableCard {...props} className="bg-green-300">
      {props.expanded ? (
        <h2 className="text-xl font-bold">Projects Details</h2>
      ) : (
        "Projects"
      )}
    </ExpandableCard>
  );
}

export default Projects;
