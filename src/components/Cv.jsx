import { FiDownload } from "react-icons/fi";
import Sheet, { Develop } from "./Sheet";
import cvPdf from "../assets/Emilia_Sipola_CV.pdf";

const sections = [
  {
    title: "Education",
    items: [
      { role: "B.Sc. Computer Science",  place: "Tampere University",              period: "2022 – on break",      notes: null },
      { role: "Matriculation Exam",       place: "Helsinki Upper Secondary School of Natural Sciences",    period: "2018 – 2022"},
    ],
  },
  {
    title: "Experience",
    items: [
      { role: "Founder & Owner",             place: "Mrrp Software",           period: "2026 – present",  notes: "My own company (sole proprietorship) making games and software tools. Building purr, a terminal coding agent (Python); Save Timelapse, a timelapse renderer for Factorio (Rust, Lua); and an indie game in Godot." },
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

function CvSection({ section, i }) {
  // Languages read best as one line each: "Finnish ... Native"
  const compact = section.items.every((item) => !item.period && !item.notes);
  return (
    <Develop as="section" i={i} className="cv-section" data-section={section.title} tabIndex={-1}>
      <h3 className="type-label">{section.title}</h3>
      <ul className="cv-list">
        {section.items.map((item) =>
          compact ? (
            <li key={item.role} className="cv-item flex items-baseline justify-between gap-3">
              <span className="cv-role">{item.role}</span>
              <span className="cv-place">{item.place}</span>
            </li>
          ) : (
            <li key={item.role} className="cv-item">
              <div className="flex items-baseline justify-between gap-3">
                <span className="cv-role">{item.role}</span>
                {item.period && <span className="cv-period">{item.period}</span>}
              </div>
              <span className="cv-place">{item.place}</span>
              {item.notes && <p className="cv-notes">{item.notes}</p>}
            </li>
          ),
        )}
      </ul>
    </Develop>
  );
}

function Cv({ sheet }) {
  return (
    <Sheet
      sheet={sheet}
      label="CV"
      title={<h2 className="type-title">CV</h2>}
      // The list under the title; once opened it's an index that jumps to each section
      index={sections.map((s) => ({ key: s.title, label: s.title }))}
      foot={
        <a href={cvPdf} download="Emilia_Sipola_CV.pdf" className="link-quiet self-start">
          <FiDownload aria-hidden="true" /> Download PDF
        </a>
      }
    >
      <Develop i={0} className="cv-download">
        <a href={cvPdf} download="Emilia_Sipola_CV.pdf" className="btn-primary">
          <FiDownload aria-hidden="true" /> Download PDF
        </a>
      </Develop>
      <div className="grid gap-x-10 lg:grid-cols-2">
        <div>
          <CvSection section={sections[0]} i={1} />
          <CvSection section={sections[1]} i={2} />
        </div>
        <div>
          <CvSection section={sections[2]} i={3} />
          <CvSection section={sections[3]} i={4} />
        </div>
      </div>
    </Sheet>
  );
}

export default Cv;
