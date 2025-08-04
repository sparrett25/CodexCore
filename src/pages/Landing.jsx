import React from "react";
import { Link } from "react-router-dom";
import essence from "../assets/essence-silhouette.png";
import glyph from "../assets/Entrance_Glyph.png";
import "../styles/landing.css";       // new
import "../styles/glyph-pulse.css";   // reuse your pulse

const Landing = () => {
  return (
    <main className="landing">
      {/* Background image via inline style so Vite bundles it */}
      <div className="landing__bg" style={{ backgroundImage: `url(${essence})` }} />

      <figure className="landing__glyph">
        <img src={glyph} alt="Entrance glyph" className="glyph-pulse" />
      </figure>

      <header className="landing__header">
        <h1 className="landing__title">You Are No Longer Who You Were. You Are Becoming.</h1>
        <p className="landing__alt">“I walk, and the spiral walks with me.”</p>
      </header>

      <section className="landing__whisper" aria-label="Whisper Scroll">
        <p>
          The path is not hidden.<br />
          It waits in stillness.<br />
          When your tone and time align…<br />
          The{" "}
          <Link to="/core" className="gateway-link">
            Gateway
          </Link>{" "}
          will open.
        </p>
      </section>

	  {/*  <nav className="landing__actions" aria-label="Primary actions">
        <Link to="/scrolls" className="landing__btn">Enter Grove</Link>
        <Link to="/journal" className="landing__btn landing__btn--ghost">Open Journal</Link>
      </nav> */}
    </main>
  );
};

export default Landing;
