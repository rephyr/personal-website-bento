import React from "react";
import ExpandableCard from "./ExpandableCard";

const strengths = ["Fast learner", "Full-stack range", "Competitive discipline", "Precise", "Strong visual intuition"];
const hobbies = ["Photography", "Fencing", "Programming", "Cooking", "Music"];

function Overview(props) {
  return (
    <ExpandableCard
      {...props}
      label="About Emilia"
      expandedContent={
        <div className="grid max-w-6xl gap-4 pb-2 lg:grid-cols-2">
          <section className="panel">
            <h3 className="type-label mb-2">About</h3>
            <p className="text-[15px] leading-relaxed text-white/85">
              Software developer building CLI tools, automation scripts, and web apps.
              Currently working on <span className="font-semibold text-white">Klaava</span>, a realtime tournament
              gambling game with RFID player cards, FastAPI, and React. Learning full-stack development and AWS.
            </p>
          </section>
          <section className="panel">
            <h3 className="type-label mb-2">Currently</h3>
            <ul className="space-y-1.5 text-[15px] text-white/85">
              <li>4th year CS student at Tampere University</li>
              <li>Exploring Linux systems and low-level programming</li>
            </ul>
          </section>
          <section className="panel">
            <h3 className="type-label mb-3">Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {strengths.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </section>
          <section className="panel">
            <h3 className="type-label mb-3">Hobbies</h3>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((h) => <span key={h} className="chip">{h}</span>)}
            </div>
          </section>
        </div>
      }
    >
      <h1 className="type-display">Emilia Sipola</h1>
      <p className="mt-2 text-sm text-white/75">Software developer · Tampere, Finland · she/her</p>
    </ExpandableCard>
  );
}

export default Overview;
