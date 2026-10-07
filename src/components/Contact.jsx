import Sheet, { Develop } from "./Sheet";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

const contacts = [
  { label: "GitHub",    value: "rephyr",                  href: "https://github.com/rephyr",                             icon: FaGithub },
  { label: "LinkedIn",  value: "Emilia Sipola",            href: "https://www.linkedin.com/in/emilia-sipola-597aa7379/",  icon: FaLinkedin },
  { label: "Email",     value: "sipolaemilia@proton.me",  href: "mailto:sipolaemilia@proton.me",                        icon: FaEnvelope },
];

const email = contacts.find((c) => c.label === "Email");
const profiles = contacts.filter((c) => c !== email);

// mailto: links open the mail app, everything else opens in a new tab
const linkProps = (href) =>
  href.startsWith("http") ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };

function Contact({ sheet }) {
  return (
    <Sheet
      sheet={sheet}
      label="Contact"
      title={<h2 className="type-title">Contact</h2>}
      // Straight to her profiles from the collapsed card; the email is the card's foot
      hint={
        <ul className="contact-hint link-zone type-hint">
          {profiles.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a {...linkProps(href)}>
                <Icon aria-hidden="true" />
                <span className="contact-hint-label">{label}</span>
                <FiArrowUpRight aria-hidden="true" className="hint-arrow" />
              </a>
            </li>
          ))}
        </ul>
      }
      foot={
        <a href={email.href} className="card-email">
          {email.value}
        </a>
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
              {/* A narrow sheet wraps the email at the @ instead of mid-word */}
              <span className="contact-value">
                {value.includes("@") ? <>{value.split("@")[0]}<wbr />@{value.split("@")[1]}</> : value}
              </span>
              <FiArrowUpRight aria-hidden="true" className="contact-arrow" />
            </a>
          </Develop>
        ))}
      </ul>
    </Sheet>
  );
}

export default Contact;
