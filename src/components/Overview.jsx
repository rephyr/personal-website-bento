import React from "react";
import OverviewHover from "./OverviewHover";
import OverviewContent from "./OverviewContent";

function Overview({ expanded, onExpand, onClose }) {
  return (
    <>
      {expanded ? (
        <div className="absolute top-10 left-10 right-10 bottom-10 bg-white rounded-xl outline outline-2 outline-pink-300 p-10 overflow-auto z-50">
          <button
            onClick={onClose}
            className="mb-4 px-3 py-1 bg-pink-300 rounded hover:bg-pink-400"
          >
            Close
          </button>
          <OverviewContent />
        </div>
      ) : (
        <div
          className="col-span-2 row-span-1 rounded-xl bg-white outline outline-2 outline-pink-300 hover-grow cursor-pointer"
          onClick={onExpand}
        >
          <OverviewHover />
        </div>
      )}
    </>
  );
}


export default Overview;
