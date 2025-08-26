import React from "react";

function ExpandableCard({
  expanded,
  onExpand,
  onClose,
  dimmed,
  rect,
  containerRect,
  children,
  className = "",
  paddingClass = "p-4", 
}) {
  const style = expanded
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: containerRect.width,
        height: containerRect.height,
        zIndex: 100,
        transition: "all 0.7s ease-in-out",
      }
    : {
        position: "absolute",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        zIndex: dimmed ? 5 : 10,
        transition: "all 0.7s ease-in-out",
      };

  return (
    <div
      onClick={!expanded && !dimmed ? onExpand : undefined}
      style={style}
      className={`rounded-xl shadow-lg cursor-pointer ${paddingClass} ${className} ${
        dimmed ? "opacity-30 pointer-events-none" : ""
      }`}
    >
      {expanded ? (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="mb-4 px-3 py-1 bg-pink-300 rounded hover:bg-pink-400"
          >
            Close
          </button>
          {children}
        </>
      ) : (
        children
      )}
    </div>
  );
}

export default ExpandableCard;
