import React from "react";
import ExpandableCard from "./ExpandableCard";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

const contacts = [
  { label: "GitHub",    value: "rephyr",                  href: "https://github.com/rephyr",                             icon: FaGithub },
  { label: "LinkedIn",  value: "Emilia Sipola",            href: "https://www.linkedin.com/in/emilia-sipola-597aa7379/",  icon: FaLinkedin },
  { label: "Instagram", value: "@emiliasipolaa",           href: "https://www.instagram.com/emiliasipolaa",               icon: FaInstagram },
  { label: "Email",     value: "sipolaemiliaa@gmail.com",  href: "mailto:sipolaemiliaa@gmail.com",                        icon: FaEnvelope },
];

// mailto: links open the mail app, everything else opens in a new tab
const linkProps = (href) =>
  href.startsWith("http") ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };

function ContactCard({ c }) {
  const Icon = c.icon;
  return (
    <a
      {...linkProps(c.href)}
      className="panel flex items-center gap-4 p-5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Icon className="flex-shrink-0 text-2xl text-white/70" />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="type-label">{c.label}</span>
        <span className="truncate text-base font-medium text-white">{c.value}</span>
      </div>
    </a>
  );
}

function Contact(props) {
  return (
    <ExpandableCard
      {...props}
      label="Contact"
      collapsedContent={
        <ul className="flex gap-3 text-base text-white/75">
          {contacts.map(({ label, icon: Icon }) => (
            <li key={label}>
              <Icon aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </li>
          ))}
        </ul>
      }
      expandedContent={
        <div className="grid max-w-4xl gap-3 pb-2 md:grid-cols-2">
          {contacts.map((c) => <ContactCard key={c.label} c={c} />)}
        </div>
      }
    >
      <h2 className="type-title">Contact</h2>
    </ExpandableCard>
  );
}

export default Contact;
