import React from "react";
import ExpandableCard from "./ExpandableCard";
import { SiPython, SiCplusplus, SiReact, SiTailwindcss, SiJavascript, SiHtml5, SiCss, SiPhp, SiSqlite, SiSqlalchemy, SiGit, SiGitlab } from "react-icons/si";
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
    description: "Used Python for CLI tools and automation scripts. C++ for systems programming. PHP for university coursework. I wrote and coordinated unit tests using CakePHP and PHPUnit on the MMT project management app.",
    techs: [
      { name: "Python",     icon: SiPython },
      { name: "C++",        icon: SiCplusplus },
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
    category: "Tools",
    description: "Used Git and GitLab for version control and project management in both personal and university projects.",
    techs: [
      { name: "Git",    icon: SiGit },
      { name: "GitLab", icon: SiGitlab },
    ],
  },
];

function TechIcon({ tech: { icon: Icon, img } }) {
  return img
    ? <img src={img} alt="" className="h-[1em] w-[1em] flex-shrink-0" />
    : <Icon aria-hidden="true" className="flex-shrink-0" />;
}

function Tech(props) {
  return (
    <ExpandableCard
      {...props}
      label="Tech stack"
      collapsedContent={
        <p className="text-sm text-white/75">React, Python, C++ and more</p>
      }
      expandedContent={
        <div className="grid max-w-6xl gap-4 pb-2 lg:grid-cols-2">
          {categories.map(({ category, description, techs }) => (
            <section key={category} className="panel space-y-3">
              <h3 className="type-label">{category}</h3>
              <p className="text-sm leading-relaxed text-white/75">{description}</p>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <span key={tech.name} className="chip text-base">
                    <TechIcon tech={tech} />
                    <span className="text-sm">{tech.name}</span>
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      }
    >
      <h2 className="type-title">Tech</h2>
    </ExpandableCard>
  );
}

export default Tech;
