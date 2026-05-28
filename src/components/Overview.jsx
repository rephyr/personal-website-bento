import React from "react";
import ExpandableCard from "./ExpandableCard";

function Overview(props) {
  return (
    <ExpandableCard
      {...props}
      className="rounded-xl"
    >
      <h2 className="text-white text-2xl font-bold tracking-wide">Emilia Sipola</h2>
      <p className="text-white/70 mt-1 text-sm">Software engineer · Tampere, Finland · she/her</p>

      {/* expanded content which fades in after card opens */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 16,
          right: 16,
          bottom: 16,
          opacity: props.expanded ? 1 : 0,
          transition: props.expanded ? "opacity 0.4s ease 0.7s" : "opacity 0.15s ease",
          pointerEvents: props.expanded ? "auto" : "none",
        }}
        className="flex flex-col gap-4"
      >
        {/* Bio */}
        <div className="rounded-lg p-4 bg-black/30 backdrop-blur-sm">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">About</p>
          <p className="text-white/80 text-sm leading-relaxed">
            Software engineer building CLI tools, automation scripts, and web apps.
            Currently working on <span className="text-white font-semibold">The-Tab</span>: a multiplayer
            drinking game with thermal receipt printer integration.
          </p>
        </div>

        {/* facts */}
        <div className="rounded-lg p-4 bg-black/30 backdrop-blur-sm">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Currently</p>
          <ul className="space-y-1.5 text-white/70 text-sm">
            <li>4th year CS student at Tampere University</li>
            <li>Exploring Linux systems and low-level programming</li>
          </ul>
        </div>

        {/* strengths */}
        <div className="rounded-lg p-4 bg-black/30 backdrop-blur-sm">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Strengths</p>
          <div className="flex flex-wrap gap-2">
            {["Fast learner", "Full-stack range", "Competitive discipline", "Precise", "Strong visual intuition"].map(s => (
              <span key={s} className="px-3 py-1 text-sm text-white/70 border border-white/20 rounded-full bg-white/5">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* hobbies */}
        <div className="rounded-lg p-4 bg-black/30 backdrop-blur-sm">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Hobbies</p>
          <div className="flex flex-wrap gap-2">
            {["Photography", "Fencing", "Programming", "Cooking", "Music"].map(h => (
              <span key={h} className="px-3 py-1 text-sm text-white/70 border border-white/20 rounded-full bg-white/5">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ExpandableCard>
  );
}

export default Overview;
