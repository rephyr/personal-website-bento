import React from "react";
import ExpandableCard from "./ExpandableCard";

function Overview(props) {
  return (
    <ExpandableCard
      {...props}
      className="bg-blue-300 rounded-xl"
    >
      {props.expanded ? <h2>Overview Details</h2> : "Overview"}
    </ExpandableCard>
  );
}

export default Overview;
