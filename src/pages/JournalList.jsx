// /src/pages/JournalList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { journalSample } from "../data/journalSample";
import "../styles/journal.css";

const CATS = ["all", "earthbeat", "weekly", "feature"];

export default function JournalList() {
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  const entries = useMemo(() => {
    let list = [...journalSample].sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at)
    );
    if (cat !== "all") list = list.filter((e) => e.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.summary || "").toLowerCase().includes(q) ||
          (e.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [cat, query]);

  // Scroll-reveal observer
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const els = root.querySelectorAll(".card.reveal");
    const io = new IntersectionObserver(
      (entriesObs) => {
        entriesObs.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target); // reveal once
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [entries]);

  return (
    <div className="journal-wrap page-enter">
      <header className="journal-header">
        <h1 className="journal-title">Lumina Journal</h1>
        <p className="journal-sub">Earthbeat • Weekly Reflections • Features</p>

        <div className="journal-controls">
          <div className="pill-group">
            {CATS.map((c) => (
              <button
                key={c}
                className={`pill ${c} ${c === cat ? "active" : ""}`}
                onClick={() => setCat(c)}
                aria-pressed={c === cat}
              >
                {c === "all" ? "All" : c[0].toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          <input
            className="journal-search"
            placeholder="Search by title, tag, or summary…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search journal entries"
          />
        </div>
      </header>

      <section className="journal-grid" ref={containerRef}>
        {entries.map((e, idx) => (
          <article
            key={e.slug}
            className={`card ${e.category} reveal`}
            style={{ "--reveal-delay": idx }}
          >
            <Link to={`/journal/${e.slug}`} className="card-link">
              <div className="thumb">
                {e.cover_image_url ? (
                  <img src={e.cover_image_url} alt={e.title} />
                ) : (
                  <div className="thumb-fallback" />
                )}
                <span className="badge">
                  {e.category === "earthbeat"
                    ? "Earthbeat"
                    : e.category === "weekly"
                    ? "Weekly"
                    : e.category === "feature"
                    ? "Feature"
                    : e.category}
                </span>
              </div>

              <div className="meta">
                <h3 className="card-title">{e.title}</h3>
                <p className="card-summary">{e.summary}</p>

                <div className="meta-row">
                  <time dateTime={e.published_at}>
                    {new Date(e.published_at).toLocaleDateString()}
                  </time>
                  <div className="tag-row">
                    {(e.tags || []).slice(0, 3).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
