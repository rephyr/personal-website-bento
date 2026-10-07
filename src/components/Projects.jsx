import { FaGithub } from "react-icons/fa";
import Sheet, { Develop } from "./Sheet";
import saveTimelapseImg from "../assets/save-timelapse.gif";
import theTabImg from "../assets/the-tab-menu.png";
import smPlayerImg from "../assets/smFilePlaybackExample.gif";
import weatherImg from "../assets/WeatherappAppPicture.jpg";
import portfolioImg from "../assets/portfolio.webp";
import purrImg from "../assets/purr-thumb.webp";

const slug = (name) => name.toLowerCase().replace(/\W+/g, "-");

// North star project: first in the hint list and featured above the others when opened
const featured = {
  name: "Save Timelapse",
  // Written for recruiters who don't know Factorio: why it's hard, not how it works
  description: "Turns a long playthrough of Factorio, a game about building huge automated factories, into an interactive timelapse. The challenge is scale: one factory can hold hundreds of thousands of objects, so it's built in Rust from the ground up for performance, with its own file format, renderer and video export.",
  stack: ["Rust", "Lua"],
  image: saveTimelapseImg,
  url: "https://github.com/rephyr/save-timelapse",
};

const projects = [
  {
    name: "purr",
    description: "A cute coding agent for the terminal, built to get more out of small local models on long, vague tasks. It repairs the model's slips, checks every edit with lint and tests, catches loops, and splits big tasks into small tickets. Written in Python; scores 82% on Terminal-Bench 2.1 with DeepSeek V4.1 Flash.",
    image: purrImg,
    url: "https://github.com/rephyr/purr",
  },
  {
    name: "Personal Portfolio",
    description: "This website: a bento grid of cards that open into sheets over a fixed photo background, with staged fade-ins. Built with React, Vite and Tailwind.",
    image: portfolioImg,
    url: "https://github.com/rephyr/personal-website-bento",
  },
  {
    name: "The Tab",
    description: "A CLI app with thermal receipt printer integration. Multiplayer drinking game with real-time score tracking, an all-time leaderboard, and automatic receipt printing after each game.",
    image: theTabImg,
    url: "https://github.com/rephyr/The-Tab",
  },
  {
    name: "SMFileParser",
    description: "C++ bot that parses .sm rhythm game charts and plays them back with precise timing by simulating keyboard inputs. Works with StepMania and Etterna.",
    image: smPlayerImg,
    url: "https://github.com/rephyr/SMFileParser",
  },
  {
    name: "React Weather App",
    description: "A responsive weather app built with React that fetches real-time weather data. Features location search, current conditions, and a clean interface.",
    image: weatherImg,
    url: "https://github.com/rephyr/React-Weather-App",
  },
];

function Projects({ sheet }) {
  return (
    <Sheet
      sheet={sheet}
      label="Projects"
      title={<h2 className="type-title">Projects</h2>}
      // The list under the title; once opened it's an index that jumps to each project
      index={[
        { key: slug(featured.name), label: featured.name, strong: true },
        ...projects.map((p) => ({ key: slug(p.name), label: p.name })),
      ]}
    >
      <Develop i={0} className="project-feature" data-section={slug(featured.name)} tabIndex={-1}>
        <img src={featured.image} alt={`${featured.name} replaying a Factorio factory as it grows`} className="project-shot" />
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <div>
            <p className="type-label">Featured project</p>
            <h3 className="project-name mt-1.5">{featured.name}</h3>
          </div>
          <a href={featured.url} target="_blank" rel="noopener noreferrer" className="link-quiet">
            <FaGithub aria-hidden="true" /> View on GitHub
          </a>
        </div>
        <p className="plate-body mt-2">{featured.description}</p>
        <p className="mt-2 text-[13px] text-white/60">{featured.stack.join(" · ")}</p>
      </Develop>

      <ol className="project-list">
        {projects.map((project, i) => (
          <Develop key={project.name} as="li" i={i + 1} className="project" data-section={slug(project.name)} tabIndex={-1}>
            {/* Screenshots sit in monochrome with the rest of the page and develop into colour on hover */}
            <img src={project.image} alt={`Screenshot of ${project.name}`} loading="lazy" className="project-shot" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="project-name">{project.name}</h3>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="link-quiet">
                  <FaGithub aria-hidden="true" /> View on GitHub
                </a>
              </div>
              <p className="plate-body mt-1.5">{project.description}</p>
            </div>
          </Develop>
        ))}
      </ol>
    </Sheet>
  );
}

export default Projects;
