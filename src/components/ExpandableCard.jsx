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
  collapsedContent,
  expandedContent,
  contentTop = 56,
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

  // counter-translate so the image stays fixed in world space (curtain effect)
  const innerStyle = {
    position: "absolute",
    top: expanded ? 0 : -rect.top,
    left: expanded ? 0 : -rect.left,
    width: containerRect.width,
    height: containerRect.height,
    transition: "all 0.7s ease-in-out",
  };

  const contentBase = {
    position: "absolute",
    top: contentTop,
    left: 16,
    right: 16,
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
      {/* Image layer — counter-translated, stays fixed in world space */}
      <div style={innerStyle} className="relative">
        <img
          src={photo}
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          draggable={false}
        />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: `rgba(0,0,0,${expanded ? 0.5 : 0})`, transition: "background 0.7s ease-in-out" }} />
        <p style={{ position: "absolute", bottom: 8, right: 12 }} className="text-white/60 text-xs italic select-none">© Emilia Sipola. All rights reserved.</p>
      </div>

      {/* Content layer — card-anchored */}
      <div className={`absolute inset-0 z-10 ${paddingClass}`}>
        {expanded && (
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-3 right-3 z-10 px-3 py-1 text-white font-bold border border-white rounded hover:bg-white hover:text-black transition-colors"
          >
            Close
          </button>
        )}

        {/* Title area — always visible, moves with card */}
        {children}

        {/* Collapsed summary — fades out on expand */}
        {collapsedContent && (
          <div style={{
            ...contentBase,
            opacity: expanded ? 0 : 1,
            transition: expanded ? "opacity 0.2s ease" : "opacity 0.3s ease 0.5s",
            pointerEvents: "none",
          }}>
            {collapsedContent}
          </div>
        )}

        {/* Expanded detail — fades in after card finishes opening */}
        {expandedContent && (
          <div style={{
            ...contentBase,
            bottom: 16,
            overflow: "auto",
            opacity: expanded ? 1 : 0,
            transition: expanded ? "opacity 0.4s ease 0.7s" : "opacity 0.15s ease",
            pointerEvents: expanded ? "auto" : "none",
          }}>
            {expandedContent}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpandableCard;
