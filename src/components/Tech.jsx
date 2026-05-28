import React from "react";
import ExpandableCard from "./ExpandableCard";
import { SiPython, SiCplusplus, SiReact, SiTailwindcss, SiJavascript, SiHtml5, SiCss, SiPhp, SiSqlite, SiSqlalchemy } from "react-icons/si";
import { FaDatabase } from "react-icons/fa";
import adobePs from "../assets/adobe-photoshop.svg";
import adobeLr from "../assets/adobe-lightroom.svg";
import adobePr from "../assets/adobe-premiere.svg";

const categories = [
  {
    category: "Frontend",
    description: "Built web apps and personal projects including a React weather app and this portfolio. Comfortable building UIs from scratch with HTML, CSS, JavaScript, React and Tailwind.",
    techs: [
      { name: "React",      icon: SiReact },
      { name: "Tailwind",   icon: SiTailwindcss },
      { name: "JavaScript", icon: SiJavascript },
      { name: "HTML",       icon: SiHtml5 },
      { name: "CSS",        icon: SiCss },
    ],
  },
  {
    category: "Backend",
    description: "Used Python for CLI tools and automation scripts. PHP for university coursework. I wrote and coordinated unit tests using CakePHP and PHPUnit on the MMT project management app.",
    techs: [
      { name: "Python",     icon: SiPython },
      { name: "PHP",        icon: SiPhp },
      { name: "SQL",        icon: FaDatabase },
      { name: "SQLite",     icon: SiSqlite },
      { name: "SQLAlchemy", icon: SiSqlalchemy },
    ],
  },
  {
    category: "Adobe",
    description: "I create art through photography, using Lightroom and Photoshop for editing and retouching, and Premiere Pro for video post-production.",
    techs: [
      { name: "Photoshop",    img: adobePs },
      { name: "Lightroom",    img: adobeLr },
      { name: "Premiere Pro", img: adobePr },
    ],
  },
  {
    category: "Systems",
    description: "Built SMFilePlayer in C++.A bot that parses .sm rhythm game charts and replays them with precise timing by simulating keyboard inputs.",
    techs: [
      { name: "C++", icon: SiCplusplus },
    ],
  },
];

function Tech(props) {
  return (
    <ExpandableCard
      {...props}
      collapsedContent={
        <p className="text-white/50 text-sm">My tech stack</p>
      }
      expandedContent={
        <div className="space-y-3">
          {categories.map(({ category, description, techs }) => (
            <div key={category} className="rounded-lg p-3 bg-black/20 backdrop-blur-sm space-y-2">
              <p className="text-white/40 text-xs uppercase tracking-widest">{category}</p>
              <p className="text-white/60 text-xs leading-relaxed">{description}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {techs.map(({ name, icon: Icon, img }) => (
                  <span key={name} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white border border-white/50 rounded-full bg-white/10 backdrop-blur-sm">
                    {img
                      ? <img src={img} style={{ width: 18, height: 18, flexShrink: 0 }} alt={name} />
                      : <Icon className="text-lg" />
                    }
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    >
      <h2 className="text-white text-2xl font-bold tracking-wide">Tech</h2>
    </ExpandableCard>
  );
}

export default Tech;
