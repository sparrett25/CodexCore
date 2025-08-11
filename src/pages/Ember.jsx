// /src/pages/Ember.jsx
import React, { useCallback, useState } from "react";
import ember from "../data/ember.json";
import "../styles/codexEmber.css";

/* ---- Tone colors & helpers ---- */
const TONE_COLORS = {
  // Core tones used across the Codex
  presence: "#5fe3d1",
  clarity: "#93b0ff",
  breath: "#a6e6ff",
  remembrance: "#d7b3ff",
  return: "#ffc99a",
  stillness: "#b8c7ff",
  fire: "#ff9c73",
  origin: "#ffd98a",
  truth: "#a1ffcf",
  constellation: "#b49cff",

  // Ember-specific tags from ember.json
  evening: "#ffb3a6",
  closure: "#c7b5ff",
  soften: "#ffd9c2",
  morning: "#fff0a6",
  opening: "#a6ffd3",
  intent: "#a6d8ff",
  movement: "#b3ffb8",
  restore: "#a6e0ff",
  language: "#ffd3e0",
  tone: "#e0b3ff",

  default: "#9eb6ff",
};

function hexToRgba(hex, alpha = 1) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(158,182,255,${alpha})`;
  const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getTagBadgeStyles(tag) {
  const base = TONE_COLORS[tag] || TONE_COLORS.default;
  return {
    background: hexToRgba(base, 0.18),
    border: `1px solid ${hexToRgba(base, 0.30)}`,
    color: "#e9ecf5",
  };
}

/* Use first tag as the tone key for the aura */
function getAuraStyles(tags = []) {
  const primary = tags[0] || "default";
  const base = TONE_COLORS[primary] || TONE_COLORS.default;
  const strong = hexToRgba(base, 0.32);
  const soft   = hexToRgba(base, 0.18);
  return {
    position: "absolute",
    inset: "-40px",
    zIndex: 0,
    pointerEvents: "none",
    filter: "blur(16px)",
    opacity: 0.9,
    background: `
      radial-gradient(360px 140px at 18% 0%, ${strong}, transparent 70%),
      radial-gradient(520px 200px at 82% 0%, ${soft}, transparent 72%)
    `,
  };
}

/* ---- Tags come from ember.json's `tags` field ---- */
function getTags(it) {
  if (!it) return [];
  if (Array.isArray(it.tags)) return it.tags;
  if (Array.isArray(it.tone_tags)) return it.tone_tags;
  if (typeof it.tone === "string") return [it.tone];
  if (typeof it.category === "string") return [it.category];
  return [];
}

/* ---- Quick Start strip ---- */
const QuickStart = () => {
  const go = useCallback((targetId) => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <nav className="ember-quickstart" aria-label="Quick Start">
      <button className="qs-btn" onClick={() => go("r-nightfall")}>Nightfall</button>
      <button className="qs-btn" onClick={() => go("r-firstlight")}>First Light</button>
    </nav>
  );
};

/* ---- Section renderer ---- */
const Section = ({ title, description, items = [], itemIdPrefix }) => (
  <section className="ember-section">
    <header className="ember-section__header">
      <h2 className="ember-section__title">{title}</h2>
      {description ? <p className="ember-section__desc">{description}</p> : null}
    </header>

    {items.length > 0 ? (
      <ul className="ember-grid" aria-label={title}>
        {items.map((it) => {
          const tags = getTags(it);
          const cardId = it.id || `${itemIdPrefix}-${it.title}`;
          return (
            <li
              id={cardId}
              key={cardId}
              className="ember-card"
              style={{ position: "relative", overflow: "hidden" }}
            >
              {/* Aura keyed to first tag */}
              {tags.length > 0 ? <div className="card-aura" style={getAuraStyles(tags)} /> : null}

              <div className="ember-card__body" style={{ position: "relative", zIndex: 1 }}>
				<div className="ember-card__titlebar">
				<h3 className="ember-card__title">{it.title}</h3>
				{it.featured ? <span className="ember-badge ember-badge--featured">Featured</span> : null}
			  </div>
                {it.subtitle ? <p className="ember-card__subtitle">{it.subtitle}</p> : null}
                {it.description ? <p className="ember-card__text">{it.description}</p> : null}

                {Array.isArray(it.steps) && it.steps.length > 0 ? (
                  <ol className="ember-steps" aria-label={`${it.title} steps`}>
                    {it.steps.map((step, idx) => (
                      <li key={`${cardId}-s${idx}`} className="ember-step">
                        <span className="ember-step__index">{idx + 1}</span>
                        <span className="ember-step__text">{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}

                {tags.length > 0 ? (
                  <ul className="ember-tags" aria-label={`${it.title} tags`}>
                    {tags.map((tag) => (
                      <li
                        key={`${cardId}-${tag}`}
                        className="ember-tag"
                        style={getTagBadgeStyles(tag)}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {it.link ? (
                <footer className="ember-card__footer" style={{ position: "relative", zIndex: 1 }}>
                  <a className="ember-link" href={it.link}>Open</a>
                </footer>
              ) : null}
            </li>
          );
        })}
      </ul>
    ) : null}
  </section>
);

/* ---- Page ---- */
const Ember = () => {
  const { intro, rituals = [], sequences = [], resources = [] } = ember || {};
   const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
   const visibleRituals = showFeaturedOnly ? rituals.filter(r => r.featured) : rituals;

  return (
    <main className="codex-page">
      <header className="codex-page__header">
        <h1 className="codex-page__title">Ember</h1>
        <p className="codex-page__subtitle">
          A living hearth for daily rituals — Nightfall & First Light — plus gentle practices and resources.
        </p>
        {intro?.note ? <p className="ember-intro">{intro.note}</p> : null}
		
		<aside className="ember-howto">
		<h3 className="ember-howto__title">How to use these rituals</h3>
		<p className="ember-howto__text">
			Start small. Choose <strong>one</strong> ritual and repeat it for a few days.
			Rituals align <em>breath</em>, <em>attention</em>, and <em>tone</em>—their power comes from
			<em> consistency</em>, not complexity. When you’re ready, explore the <strong>Featured</strong> set for quick, reliable anchors.
		</p>
		</aside>
		
      </header>

      <QuickStart />

      <section className="ember-section">
     <header className="ember-section__header">
       <h2 className="ember-section__title">Daily Rituals</h2>
       <p className="ember-section__desc">
         Anchor your mornings and evenings with simple, repeatable ceremonies.
       </p>
       <div className="ember-filter" role="toolbar" aria-label="Ritual filter">
         <button
           className={`ember-filter__btn ${!showFeaturedOnly ? "is-active" : ""}`}
           onClick={() => setShowFeaturedOnly(false)}
         >
           All
         </button>
         <button
           className={`ember-filter__btn ${showFeaturedOnly ? "is-active" : ""}`}
           onClick={() => setShowFeaturedOnly(true)}
         >
           Featured
         </button>
       </div>
     </header>
     <Section
       title=""
       description=""
       items={visibleRituals}
       itemIdPrefix="ritual"
     />
   </section>

      <Section
        title="Sequences & Practices"
        description="Longer flows for weekends or deeper restoration."
        items={sequences}
        itemIdPrefix="sequence"
      />

      <Section
        title="Resources"
        description="Reference scrolls, prompts, and supportive materials."
        items={resources}
        itemIdPrefix="resource"
      />
    </main>
  );
};

export default Ember;
