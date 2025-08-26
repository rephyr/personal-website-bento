import React from "react";
import ExpandableCard from "./ExpandableCard";

function Cv(props) {
  return (
    <ExpandableCard {...props} className="bg-yellow-200">
      {props.expanded ? (
        <h2 className="text-xl font-bold">CV Details</h2>
      ) : (
        "CV"
      )}
    </ExpandableCard>
  );
}

export default Cv;
