import React, { useState } from "react";
import photo from "../assets/DSC_3625.JPG";

function ExpandableCard({
  expanded,
  onExpand,
  onClose,
  dimmed,
  rect,
  containerRect,
  children,
  worldContent,
  staticContent,
  staticTop = 56,
  staticLeft = 16,
  className = "",
  paddingClass = "p-4",
}) {
  const [hovered, setHovered] = useState(false);

  const outerStyle = expanded
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: containerRect.width,
        height: containerRect.height,
        zIndex: 100,
        overflow: "hidden",
        transition: "all 0.7s ease-in-out",
      }
    : {
        position: "absolute",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        zIndex: dimmed ? 5 : 10,
        overflow: "hidden",
        transform: hovered && !dimmed ? "scale(1.03)" : "scale(1)",
        transition: "all 0.7s ease-in-out, transform 0.2s ease-out",
      };

  // counter-translate so inner content stays fixed in world space while the card expands
  const innerStyle = {
    position: "absolute",
    top: expanded ? 0 : -rect.top,
    left: expanded ? 0 : -rect.left,
    width: containerRect.width,
    height: containerRect.height,
    transition: "all 0.7s ease-in-out",
  };

  return (
    <div
      onClick={!expanded && !dimmed ? onExpand : undefined}
      onMouseEnter={() => !expanded && !dimmed && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={outerStyle}
      className={`rounded-xl shadow-lg cursor-pointer ${className} ${
        dimmed ? "opacity-30 pointer-events-none" : ""
      }`}
    >
      {/* counter-translated so the photo stays fixed in world space */}
      <div style={innerStyle} className="relative">
        <img
          src={photo}
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          draggable={false}
        />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: `rgba(0,0,0,${expanded ? 0.5 : 0})`, transition: "background 0.7s ease-in-out" }} />
        <p style={{ position: "absolute", bottom: 8, right: 12 }} className="text-white/60 text-xs italic select-none">© Emilia Sipola. All rights reserved.</p>
        {worldContent}
        {staticContent && (
          <div style={{
            position: "absolute",
            top: staticTop * (containerRect.height / 600),
            left: staticLeft * (containerRect.width / 900),
            right: 0,
            bottom: 196,
            overflow: "auto",
            opacity: expanded ? 1 : 0,
            transition: expanded ? "opacity 0.4s ease 0.7s" : "opacity 0.15s ease",
          }} className="z-10">
            {staticContent}
          </div>
        )}
      </div>
      {/* anchored to the card; extra content is clipped by overflow:hidden and revealed as the card grows */}
      <div className={`absolute inset-0 z-10 ${paddingClass}`}>
        {expanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3 right-3 z-10 px-3 py-1 text-white font-bold border border-white rounded hover:bg-white hover:text-black transition-colors"
          >
            Close
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export default ExpandableCard;
