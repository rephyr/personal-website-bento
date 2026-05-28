import React from "react";
import ExpandableCard from "./ExpandableCard";
import { FaGithub, FaLinkedin, FaInstagram, FaDiscord, FaEnvelope } from "react-icons/fa";

const contacts = [
  { label: "GitHub",    value: "rephyr",                  href: "https://github.com/rephyr",                              icon: FaGithub },
  { label: "LinkedIn",  value: "Emilia Sipola",            href: "https://www.linkedin.com/in/emilia-sipola-597aa7379/",   icon: FaLinkedin },
  { label: "Instagram", value: "@emiliasipolaa",           href: "https://www.instagram.com/emiliasipolaa",                icon: FaInstagram },
  { label: "Discord",   value: "ainiijoo",                 href: null,                                                     icon: FaDiscord },
  { label: "Email",     value: "sipolaemiliaa@gmail.com",  href: "mailto:sipolaemiliaa@gmail.com",                         icon: FaEnvelope },
];

function Contact(props) {
  return (
    <ExpandableCard {...props}>
      <h2 className="text-white text-2xl font-bold tracking-wide">Contact</h2>

      {/* visible when collapsed, fade out on expand */}
      <ul
        style={{
          position: "absolute",
          top: 56,
          left: 16,
          right: 16,
          opacity: props.expanded ? 0 : 1,
          transition: props.expanded ? "opacity 0.2s ease" : "opacity 0.3s ease 0.5s",
          pointerEvents: "none",
        }}
        className="space-y-2"
      >
        {contacts.map((c) => (
          <li key={c.label} className="text-white/70 text-sm">→ {c.label}</li>
        ))}
      </ul>

      {/* cards — fade in after expand */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 16,
          right: 16,
          opacity: props.expanded ? 1 : 0,
          transition: props.expanded ? "opacity 0.4s ease 0.7s" : "opacity 0.15s ease",
          pointerEvents: props.expanded ? "auto" : "none",
        }}
        className="flex flex-col gap-3"
      >
        {contacts.map((c) => {
          const Icon = c.icon;
          const inner = (
            <div className="flex items-center gap-3">
              <Icon className="text-white/60 text-2xl flex-shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-white/40 text-xs uppercase tracking-widest">{c.label}</span>
                <span className="text-white text-lg font-medium">{c.value}</span>
              </div>
            </div>
          );
          return c.href ? (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col gap-2 rounded-lg p-5 bg-black/30 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              {inner}
            </a>
          ) : (
            <div key={c.label} className="flex flex-col gap-2 rounded-lg p-5 bg-black/30 backdrop-blur-sm">
              {inner}
            </div>
          );
        })}
      </div>
    </ExpandableCard>
  );
}

export default Contact;
