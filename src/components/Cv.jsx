import React from "react";
import { FiDownload } from "react-icons/fi";
import ExpandableCard from "./ExpandableCard";
import cvPdf from "../assets/Emilia_Sipola_CV.pdf";

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
      { role: "Competitive Fencer", place: "Sabre · 9+ years active", period: null, notes: "Finnish sabre ranking #1 (2020/21) · U20 national gold 2020" },
    ],
  },
];

function Cv(props) {
  return (
    <ExpandableCard
      {...props}
      label="CV"
      collapsedContent={
        <ul className="space-y-1.5 text-sm text-white/75">
          {sections.map((s) => <li key={s.title}>{s.title}</li>)}
        </ul>
      }
      expandedContent={
        <div className="max-w-6xl pb-2">
          <div className="mb-6 flex">
            <a href={cvPdf} download="Emilia_Sipola_CV.pdf" className="btn-primary">
              <FiDownload /> Download PDF
            </a>
          </div>
          <div className="gap-6 lg:columns-2">
            {sections.map((section) => (
              <section key={section.title} className="mb-6 break-inside-avoid">
                <h3 className="type-label mb-2">{section.title}</h3>
                <div className="flex flex-col gap-2">
                  {section.items.map((item) => (
                    <div key={item.role} className="panel p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-white">{item.role}</span>
                        {item.period && <span className="flex-shrink-0 text-xs text-white/75">{item.period}</span>}
                      </div>
                      <span className="text-sm text-white/70">{item.place}</span>
                      {item.notes && <p className="mt-1 text-sm leading-relaxed text-white/70">{item.notes}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      }
    >
      <h2 className="type-title">CV</h2>
    </ExpandableCard>
  );
}

export default Cv;
