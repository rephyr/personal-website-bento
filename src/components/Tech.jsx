import React from "react";
import ExpandableCard from "./ExpandableCard";

function Tech(props) {
  return (
    <ExpandableCard {...props} className="bg-purple-300">
      {props.expanded ? (
        <h2 className="text-xl font-bold">Tech Details</h2>
      ) : (
        "Tech"
      )}
    </ExpandableCard>
  );
}

export default Tech;
