import React from "react";
import { FaGithub } from "react-icons/fa";
import ExpandableCard from "./ExpandableCard";
import theTabImg from "../assets/the-tab-menu.png";
import smPlayerImg from "../assets/smFilePlaybackExample.gif";
import weatherImg from "../assets/WeatherappAppPicture.jpg";
import portfolioImg from "../assets/portfolio.webp";
import saveTimelapseImg from "../assets/save-timelapse.gif";

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
    name: "Personal Portfolio",
    description: "This portfolio website. Website includes bento grid with a curtain expand effect, world-space photo background, and smooth fade transitions. Built with React, Vite, and Tailwind.",
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
    name: "SMFilePlayer",
    description: "C++ bot that parses .sm rhythm game charts and plays them back with precise timing by simulating keyboard inputs. Works with StepMania and Etterna.",
    image: smPlayerImg,
    url: "https://github.com/rephyr/SMFilePlayer",
  },
  {
    name: "React Weather App",
    description: "A responsive weather app built with React that fetches real-time weather data. Features location search, current conditions, and a clean interface.",
    image: weatherImg,
    url: "https://github.com/rephyr/React-Weather-App",
  },
];

function Projects(props) {
  return (
    <ExpandableCard
      {...props}
      label="Projects"
      collapsedContent={
        <ul className="space-y-1.5 text-sm text-white/75">
          <li className="text-white">{featured.name}</li>
          {projects.map((p) => <li key={p.name}>{p.name}</li>)}
        </ul>
      }
      expandedContent={
        <div className="grid max-w-6xl gap-4 pb-2 md:grid-cols-2">
          <article className="flex flex-col overflow-hidden rounded-xl bg-black/45 ring-1 ring-white/10 backdrop-blur-sm md:col-span-2 lg:flex-row">
            <img
              src={featured.image}
              alt={`${featured.name} replaying a Factorio factory as it grows`}
              className="aspect-[21/9] w-full object-cover lg:aspect-auto lg:w-3/5"
            />
            <div className="flex flex-1 flex-col gap-2 p-5">
              <p className="type-label">Featured project</p>
              <h3 className="type-title">{featured.name}</h3>
              <p className="flex-1 text-sm leading-relaxed text-white/75">{featured.description}</p>
              <p className="text-[13px] text-white/60">{featured.stack.join(" · ")}</p>
              <a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-2 self-start"
              >
                <FaGithub /> View on GitHub
              </a>
            </div>
          </article>
          {projects.map((project) => (
            <article key={project.name} className="flex flex-col overflow-hidden rounded-xl bg-black/45 ring-1 ring-white/10 backdrop-blur-sm">
              <img src={project.image} alt={`Screenshot of ${project.name}`} className="aspect-[5/2] w-full object-cover object-top" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-semibold text-white">{project.name}</h3>
                <p className="flex-1 text-sm leading-relaxed text-white/75">{project.description}</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline mt-2 self-start"
                >
                  <FaGithub /> View on GitHub
                </a>
              </div>
            </article>
          ))}
        </div>
      }
    >
      <h2 className="type-title">Projects</h2>
    </ExpandableCard>
  );
}

export default Projects;
