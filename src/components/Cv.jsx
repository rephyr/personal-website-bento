import React from "react";
import ExpandableCard from "./ExpandableCard";

const sections = [
  {
    title: "Education",
    items: [
      { role: "B.Sc. Computer Science",  place: "Tampere University",              period: "2022 - ongoing",       notes: null },
      { role: "Matriculation Exam",       place: "Helsinki Upper Secondary School of Natural Sciences",    period: "2018 – 2022"},
    ],
  },
  {
    title: "Experience",
    items: [
      { role: "Food Manufacturing Cleaner",  place: "ISS Palvelut Oy",          period: "Mar – Aug 2023",  notes: null },
      { role: "Construction Assistant",      place: "Asiantuntijamestarit Oy",   period: "Summer 2021",     notes: null },
      { role: "Fencing Coach",               place: "Tapanilan Erä",             period: "2022",            notes: "Coached competitive fencers weekly." },
    ],
  },
  {
    title: "Languages",
    items: [
      { role: "Finnish",  place: "Native",        period: null, notes: null },
      { role: "English",  place: "Fluent",         period: null, notes: null },
      { role: "Swedish",  place: "Basic",          period: null, notes: null },
      { role: "Italian",  place: "Conversational", period: null, notes: null },
    ],
  },
  {
    title: "Athletics",
    items: [
      { role: "Competitive Fencer", place: "Sabre · 7+ years", period: null, notes: "Finnish men's sabre ranking #1 (2020/21) · U20 national gold 2020" },
    ],
  },
];

function Cv(props) {
  return (
    <ExpandableCard
      {...props}
      collapsedContent={
        <ul className="space-y-2">
          {sections.map((s) => (
            <li key={s.title} className="text-white/70 text-sm">→ {s.title}</li>
          ))}
        </ul>
      }
      expandedContent={
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{section.title}</p>
              <div className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <div key={item.role} className="rounded-lg p-3 bg-black/30 backdrop-blur-sm">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-white text-sm font-semibold">{item.role}</span>
                      {item.period && <span className="text-white/80 text-xs flex-shrink-0">{item.period}</span>}
                    </div>
                    <span className="text-white/60 text-xs">{item.place}</span>
                    {item.notes && <p className="text-white/50 text-xs mt-1 leading-relaxed">{item.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    >
      <h2 className="text-white text-2xl font-bold tracking-wide">CV</h2>
    </ExpandableCard>
  );
}

export default Cv;
