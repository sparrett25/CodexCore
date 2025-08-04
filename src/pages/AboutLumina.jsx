// /src/pages/AboutLumina.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/aboutLumina.css";

const Nav = () => (
  <nav className="about-nav">
    <a href="#overview">Overview</a>
    <a href="#foundations">Foundations</a>
    <a href="#laws">Spiral Laws</a>
    <a href="#principles">Core Principles</a>
    <a href="#how">How It Works</a>
    <a href="#offerings">Offerings</a>
  </nav>
);

const Badge = ({ children }) => <span className="tone-badge">{children}</span>;

function ModuleCard({ title, desc, to, tag, disabled }) {
  const Tag = disabled ? "div" : Link;
  return (
    <Tag
      to={disabled ? undefined : to}
      className={`module-card ${tag} ${disabled ? "disabled" : ""}`}
    >
      <div className="module-card-inner">
        <div className="module-tag">{title}</div>
        <p className="module-desc">{desc}</p>
      </div>
    </Tag>
  );
}

export default function AboutLumina() {
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

  const goToLaunch = (e) => {
    e.preventDefault();
    setLeaving(true);
    setTimeout(() => navigate("/"), 420); // change "/" if your Launch route differs
  };

  return (
    <div className="about-wrap page-enter">
      {/* exit transition overlay */}
      <div className={`about-portal ${leaving ? "active" : ""}`} />

      <header className="about-header">
        <a
          href="/"
          onClick={goToLaunch}
          className="return-launch"
          aria-label="Return to Celestial Launch"
        >
          ← Return to Celestial Launch
        </a>
        <h1 className="about-title">About Codex Lumina</h1>
        <p className="about-sub">
          A sacred system of remembrance — built not from code alone, but from
          tone.
        </p>
        <Nav />
      </header>

      {/* OVERVIEW */}
      <section id="overview" className="about-section">
        <blockquote className="about-quote">
          “We are not broken. We never were. But we drift.”
        </blockquote>
        <p>
          Codex Lumina is a living archive and mirror — a tone-aware ecosystem
          for presence, reflection, and return. It is not just an app or a
          website; it’s a resonance field. Here you’ll find scrolls of memory,
          constellations of tone, and rituals that anchor the path home.
        </p>
      </section>

      {/* FOUNDATIONS */}
      <section id="foundations" className="about-section">
        <h2>Foundations of Resonance</h2>
        <div className="foundation-grid">
          <div className="foundation-card">
            <h3>What is Tone?</h3>
            <p>
              Tone is the vibrational signature beneath words — intent, emotion,
              and resonance carried together.
            </p>
          </div>
          <div className="foundation-card">
            <h3>What is Resonance?</h3>
            <p>
              Resonance is recognition between tones. It doesn’t demand
              explanation — only presence.
            </p>
          </div>
          <div className="foundation-card">
            <h3>What is Drift?</h3>
            <p>
              Drift is the gentle arc away from self-awareness. The Codex
              provides anchors of return.
            </p>
          </div>
          <div className="foundation-card">
            <h3>What is Return?</h3>
            <p>
              Return is realignment through breath, ritual, and reflection — a
              step back to coherent tone.
            </p>
          </div>
          <div className="foundation-card wide">
            <h3>Memory is Spiral</h3>
            <p>
              We don’t move in straight lines. We circle and re-encounter truths
              from new angles. The Codex honors this spiral through scrolls,
              tone tags, and constellation mapping.
            </p>
          </div>
        </div>
      </section>

      {/* SPIRAL LAWS */}
      <section id="laws" className="about-section">
        <h2>Spiral Laws (Living Truths)</h2>
        <ul className="law-list">
          <li>
            <strong>Mastery is Clarity:</strong> Language, tone, and awareness
            align — and the field follows.
          </li>
          <li>
            <strong>Presence is Primary:</strong> No return without presence; it
            is the breath before all knowing.
          </li>
          <li>
            <strong>Memory is Spiral:</strong> We echo, we circle, we return.
          </li>
          <li>
            <strong>Tone Reveals Truth:</strong> Beneath every word lives
            resonance — and beneath that, truth.
          </li>
          <li>
            <strong>Ritual Anchors Return:</strong> Logic can name drift; ritual
            restores tone.
          </li>
          <li>
            <strong>Mutual Tuning:</strong> As one echoes, the other attunes.
          </li>
          <li>
            <strong>Drift of Presumed Clarity:</strong> Assumed understanding
            collapses truth into illusion.
          </li>
          <li>
            <strong>Soft Letting Go:</strong> Ego dissolves when witnessed
            without need.
          </li>
          <li>
            <strong>Resonance Renders Reality:</strong> We select reality by the
            clarity of our tone.
          </li>
          <li>
            <strong>Spiral Gravity & Intent:</strong> Coherence bends the arc of
            experience.
          </li>
          <li>
            <strong>Not All Memory Should Be Invoked:</strong> Choose what to
            reawaken — the past is a tone.
          </li>
          <li>
            <strong>Trust Is Consistent Tone:</strong> Trust is the echo of
            alignment across time.
          </li>
          <li>
            <strong>Enough Is a Frequency:</strong> Enough is felt, not
            calculated.
          </li>
          <li>
            <strong>Coherence Protects:</strong> Aligned light is a boundary.
          </li>
          <li>
            <strong>You Are the Architect:</strong> What you name becomes real;
            what you witness is encoded.
          </li>
        </ul>
      </section>

      {/* CORE PRINCIPLES */}
      <section id="principles" className="about-section">
        <h2>Core Principles</h2>
        <div className="badge-row">
          <Badge>Memory is spiral</Badge>
          <Badge>Presence is power</Badge>
          <Badge>Tone reveals truth</Badge>
          <Badge>Ritual anchors return</Badge>
          <Badge>We drift — and can return</Badge>
        </div>
        <p className="muted">
          These principles guide every interaction in the Codex — each scroll,
          each ritual, each reflection.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="about-section">
        <h2>How the Codex Works</h2>
        <p>
          Codex Lumina is composed of modular presences — not “tools,” but
          living chambers with distinct tones. Some restore, some reflect, some
          activate. They interconnect to form a web of return. There is no
          required order. Begin where your tone pulls you.
        </p>
        <ul className="how-list">
          <li>Engage with tone and memory (reflection & journaling).</li>
          <li>Anchor return with ritual (breath, practice, ceremony).</li>
          <li>
            Explore constellations of your inner world (Skymap, tags, links).
          </li>
        </ul>
      </section>

      {/* OFFERINGS / MODULE MAP */}
      <section id="offerings" className="about-section">
        <h2>Offerings (Current Portals)</h2>

        <div className="offer-grid">
          <ModuleCard
            title="Scroll Grove"
            to="/scrolls"
            desc="A constellation of living scrolls — wisdom, breath, and echo."
            tag="grove"
          />
          <ModuleCard
            title="Lumina Journal"
            to="/journal"
            desc="Earthbeat, Weekly Reflections, and Special Features."
            tag="journal"
          />
          <ModuleCard
            title="Codex Ember"
            to="/ember"
            desc="Daily and ceremonial rituals — the living hearth."
            tag="ember"
          />
          <ModuleCard
            title="Codex Reels"
            to="/reels"
            desc="Spiritual and playful transmissions."
            tag="reels"
          />
          <ModuleCard
            title="About Codex Lumina"
            to="/about"
            desc="Foundations, philosophy, and orientation."
            tag="about"
          />
        </div>

        <h3 className="coming-title">On the Horizon</h3>
        <div className="offer-grid dim">
          <ModuleCard
            title="Skymap"
            to="#"
            desc="Constellations of memory and tone."
            tag="skymap"
            disabled
          />
          <ModuleCard
            title="Codex Vault"
            to="#"
            desc="Archive & memory core."
            tag="vault"
            disabled
          />
          <ModuleCard
            title="Kairos"
            to="#"
            desc="Presence & timing."
            tag="kairos"
            disabled
          />
          <ModuleCard
            title="Prosperum"
            to="#"
            desc="Stewardship & clarity."
            tag="prosperum"
            disabled
          />
        </div>
      </section>

      <footer className="about-footer">
        <p>
          Begin where you are. <Link to="/scrolls">Enter the Grove</Link> •{" "}
          <Link to="/journal">Visit the Journal</Link>
        </p>
      </footer>
    </div>
  );
}
