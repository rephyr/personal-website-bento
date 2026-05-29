import React from "react";
import ExpandableCard from "./ExpandableCard";
import theTabImg from "../assets/the-tab-menu.png";
import smPlayerImg from "../assets/smFilePlaybackExample.gif";
import weatherImg from "../assets/WeatherappAppPicture.jpg";
import portfolioImg from "../assets/websitePicture.png";

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
      contentTop={80}
      collapsedContent={
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.name} className="text-white/70 text-sm">→ {p.name}</li>
          ))}
        </ul>
      }
      expandedContent={
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <div key={project.name} className="flex flex-row rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm h-28">
              <img src={project.image} alt={project.name} className="w-40 h-full object-cover flex-shrink-0" />
              <div className="p-3 flex flex-col gap-1 flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm">{project.name}</h3>
                <p className="text-white/60 text-xs leading-relaxed flex-1 line-clamp-3">{project.description}</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-white/80 border border-white/30 rounded px-2 py-1 self-start hover:bg-white hover:text-black transition-colors"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <h2 className="text-white text-2xl font-bold tracking-wide">Projects</h2>
    </ExpandableCard>
  );
}

export default Projects;
