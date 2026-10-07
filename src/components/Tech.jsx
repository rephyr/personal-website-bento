import Sheet, { Develop } from "./Sheet";
import { SiPython, SiCplusplus, SiReact, SiTailwindcss, SiJavascript, SiHtml5, SiCss, SiPhp, SiSqlite, SiSqlalchemy, SiGit, SiGitlab, SiRust, SiLua, SiGodotengine } from "react-icons/si";
import { FaDatabase } from "react-icons/fa";
import adobePs from "../assets/adobe-photoshop.svg";
import adobeLr from "../assets/adobe-lightroom.svg";
import adobePr from "../assets/adobe-premiere.svg";

const categories = [
  {
    category: "Frontend",
    description: "Built this portfolio and other web apps from scratch with HTML, CSS, JavaScript, React and Tailwind.",
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
    description: "Python for purr, a terminal coding agent, and for CLI tools and automation scripts. C++ for systems programming. PHP for university coursework.",
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
    category: "Systems & games",
    description: "Rust for Save Timelapse, a fast timelapse renderer with its own file format and video export, and Lua for its Factorio mod. Godot for my indie game.",
    techs: [
      { name: "Rust",  icon: SiRust },
      { name: "Lua",   icon: SiLua },
      { name: "Godot", icon: SiGodotengine },
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

// A glance at the stack along the bottom of the collapsed card
const glance = [SiPython, SiRust, SiReact, SiCplusplus, SiGodotengine];

function Tech({ sheet }) {
  return (
    <Sheet
      sheet={sheet}
      label="Tech stack"
      title={<h2 className="type-title">Tech</h2>}
      hint={<p className="type-hint">Python, Rust, React and more</p>}
      foot={
        <ul className="tech-glance" aria-hidden="true">
          {glance.map((Icon, i) => <li key={i}><Icon /></li>)}
        </ul>
      }
    >
      <div className="tech-grid grid gap-x-10 gap-y-8 lg:grid-cols-2">
        {categories.map(({ category, description, techs }, i) => (
          <Develop key={category} as="section" i={i} className="rule-top">
            <h3 className="type-label">{category}</h3>
            <p className="plate-body mt-2.5">{description}</p>
            <ul className="mt-3.5 flex flex-wrap gap-1.5">
              {techs.map((tech) => (
                <li key={tech.name} className="chip">
                  <TechIcon tech={tech} />
                  <span>{tech.name}</span>
                </li>
              ))}
            </ul>
          </Develop>
        ))}
      </div>
    </Sheet>
  );
}

export default Tech;
