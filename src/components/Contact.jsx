import React from "react";
import ExpandableCard from "./ExpandableCard";

function Contact(props) {
  return (
    <ExpandableCard {...props} className="bg-pink-200">
      {props.expanded ? (
        <h2 className="text-xl font-bold">Contact Details</h2>
      ) : (
        "Contact"
      )}
    </ExpandableCard>
  );
}

export default Contact;
