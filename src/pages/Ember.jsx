import React, { useCallback } from "react";
import ember from "../data/ember.json";
import "../styles/codexEmber.css";

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

const Section = ({ title, description, items = [], itemIdPrefix }) => (
  <section className="ember-section">
    <header className="ember-section__header">
      <h2 className="ember-section__title">{title}</h2>
      {description ? <p className="ember-section__desc">{description}</p> : null}
    </header>

    {items.length > 0 ? (
      <ul className="ember-grid" aria-label={title}>
        {items.map((it) => (
          <li id={it.id || `${itemIdPrefix}-${it.title}`} key={it.id || it.title} className="ember-card">
            <div className="ember-card__body">
              <h3 className="ember-card__title">{it.title}</h3>
              {it.subtitle ? <p className="ember-card__subtitle">{it.subtitle}</p> : null}
              {it.description ? <p className="ember-card__text">{it.description}</p> : null}

              {Array.isArray(it.steps) && it.steps.length > 0 ? (
                <ol className="ember-steps" aria-label={`${it.title} steps`}>
                  {it.steps.map((step, idx) => (
                    <li key={`${(it.id || it.title)}-s${idx}`} className="ember-step">
                      <span className="ember-step__index">{idx + 1}</span>
                      <span className="ember-step__text">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : null}

              {Array.isArray(it.tags) && it.tags.length > 0 ? (
                <ul className="ember-tags" aria-label={`${it.title} tags`}>
                  {it.tags.map((tag) => (
                    <li key={`${(it.id || it.title)}-${tag}`} className="ember-tag">{tag}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            {it.link ? (
              <footer className="ember-card__footer">
                <a className="ember-link" href={it.link}>Open</a>
              </footer>
            ) : null}
          </li>
        ))}
      </ul>
    ) : null}
  </section>
);

const Ember = () => {
  const { intro, rituals = [], sequences = [], resources = [] } = ember || {};

  return (
    <main className="codex-page">
      <header className="codex-page__header">
        <h1 className="codex-page__title">Ember</h1>
        <p className="codex-page__subtitle">
          A living hearth for daily rituals — Nightfall & First Light — plus gentle practices and resources.
        </p>
        {intro?.note ? <p className="ember-intro">{intro.note}</p> : null}
      </header>

      {/* Quick Start strip */}
      <QuickStart />

      <Section
        title="Daily Rituals"
        description="Anchor your mornings and evenings with simple, repeatable ceremonies."
        items={rituals}
        itemIdPrefix="ritual"
      />

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
