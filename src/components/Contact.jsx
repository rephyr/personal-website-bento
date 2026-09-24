import Sheet, { Develop } from "./Sheet";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

const contacts = [
  { label: "GitHub",    value: "rephyr",                  href: "https://github.com/rephyr",                             icon: FaGithub },
  { label: "LinkedIn",  value: "Emilia Sipola",            href: "https://www.linkedin.com/in/emilia-sipola-597aa7379/",  icon: FaLinkedin },
  { label: "Instagram", value: "@emiliasipolaa",           href: "https://www.instagram.com/emiliasipolaa",               icon: FaInstagram },
  { label: "Email",     value: "sipolaemiliaa@gmail.com",  href: "mailto:sipolaemiliaa@gmail.com",                        icon: FaEnvelope },
];

// mailto: links open the mail app, everything else opens in a new tab
const linkProps = (href) =>
  href.startsWith("http") ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };

function Contact({ sheet }) {
  return (
    <Sheet
      sheet={sheet}
      label="Contact"
      title={<h2 className="type-title">Contact</h2>}
      hint={
        <ul className="flex gap-3 text-base text-white/75">
          {contacts.map(({ label, icon: Icon }) => (
            <li key={label}>
              <Icon aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </li>
          ))}
        </ul>
      }
    >
      <ul className="contact-list">
        {contacts.map(({ label, value, href, icon: Icon }, i) => (
          <Develop key={label} as="li" i={i}>
            <a {...linkProps(href)} className="contact-row">
              <span className="contact-label">
                <Icon aria-hidden="true" className="text-base" />
                {label}
              </span>
              <span className="contact-value">{value}</span>
              <FiArrowUpRight aria-hidden="true" className="contact-arrow" />
            </a>
          </Develop>
        ))}
      </ul>
    </Sheet>
  );
}

export default Contact;
