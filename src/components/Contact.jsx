import React from "react";
import ExpandableCard from "./ExpandableCard";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

const contacts = [
  { label: "GitHub",    value: "rephyr",                  href: "https://github.com/rephyr",                             icon: FaGithub },
  { label: "LinkedIn",  value: "Emilia Sipola",            href: "https://www.linkedin.com/in/emilia-sipola-597aa7379/",  icon: FaLinkedin },
  { label: "Instagram", value: "@emiliasipolaa",           href: "https://www.instagram.com/emiliasipolaa",               icon: FaInstagram },
{ label: "Email",     value: "sipolaemiliaa@gmail.com",  href: "mailto:sipolaemiliaa@gmail.com",                        icon: FaEnvelope },
];

function ContactCard({ c }) {
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
    <a href={c.href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
      className="rounded-lg p-5 bg-black/30 backdrop-blur-sm hover:bg-white/10 transition-colors">
      {inner}
    </a>
  ) : (
    <div className="rounded-lg p-5 bg-black/30 backdrop-blur-sm">{inner}</div>
  );
}

function Contact(props) {
  return (
    <ExpandableCard
      {...props}
      collapsedContent={
        <ul className="space-y-2">
          {contacts.map((c) => (
            <li key={c.label} className="text-white/70 text-sm">→ {c.label}</li>
          ))}
        </ul>
      }
      expandedContent={
        <div className="flex flex-col gap-3">
          {contacts.map((c) => <ContactCard key={c.label} c={c} />)}
        </div>
      }
    >
      <h2 className="text-white text-2xl font-bold tracking-wide">Contact</h2>
    </ExpandableCard>
  );
}

export default Contact;
