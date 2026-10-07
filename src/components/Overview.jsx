import Sheet, { Develop } from "./Sheet";

const strengths = ["Fast learner", "Full-stack range", "Competitive discipline", "Precise", "Strong visual intuition"];
const hobbies = ["Photography", "Fencing", "Programming", "Cooking", "Music"];
const currently = ["4th year CS student at Tampere University", "Exploring Linux systems and low-level programming"];

function Overview({ sheet }) {
  return (
    <Sheet
      sheet={sheet}
      label="About Emilia"
      title={
        <>
          <h1 className="type-display">Emilia Sipola</h1>
          {/* Each part stays whole when the line wraps, and the lines balance */}
          <p className="type-hint mt-2.5 text-balance">
            <span className="whitespace-nowrap">Software developer ·</span>{" "}
            <span className="whitespace-nowrap">Tampere, Finland ·</span>{" "}
            <span className="whitespace-nowrap">she/her</span>
          </p>
        </>
      }
      // The resting card's lower edge: what she's up to now (the first line of "Currently")
      foot={
        <p className="overview-foot">
          <span className="type-label">Currently</span>
          <span className="type-hint">{currently[0]}</span>
        </p>
      }
    >
      <Develop i={0} as="section" className="plate-block">
        <h2 className="type-label">About</h2>
        <p className="plate-lede">
          Software developer building CLI tools, automation scripts, and web apps.
          Currently working on <span className="font-semibold text-white">Klaava</span>, a realtime tournament
          gambling game with RFID player cards, FastAPI, and React. Learning full-stack development and AWS.
        </p>
      </Develop>

      <Develop i={1} as="section" className="plate-block">
        <h2 className="type-label">Currently</h2>
        <ul className="rule-list">
          {currently.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </Develop>

      <div className="plate-block grid grid-cols-2 gap-x-8">
        <Develop i={2} as="section">
          <h2 className="type-label">Strengths</h2>
          <ul className="rule-list">
            {strengths.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </Develop>
        <Develop i={3} as="section">
          <h2 className="type-label">Hobbies</h2>
          <ul className="rule-list">
            {hobbies.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </Develop>
      </div>
    </Sheet>
  );
}

export default Overview;
