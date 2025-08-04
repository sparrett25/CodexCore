// /src/pages/JournalList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import journalEntries from "../data/journalEntries.json";
import "../styles/journal.css";

/* ---------- Category + tone palette & helpers ---------- */
const CAT_COLORS = {
  earthbeat: "#7fe1a7", // green-teal
  weekly: "#93b0ff",    // indigo
  feature: "#ffd98a",   // amber
  all: "#9eb6ff",
};

const TONE_COLORS = {
  // re-use any tones you like; fallback flows to category color then default
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
  default: "#9eb6ff",
};

function hexToRgba(hex, alpha = 1) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(158,182,255,${alpha})`;
  const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getPillStyles(cat, isActive = false) {
  const base = CAT_COLORS[cat] || CAT_COLORS.all;
  const bg  = hexToRgba(base, isActive ? 0.28 : 0.16);
  const brd = hexToRgba(base, isActive ? 0.42 : 0.28);
  return { background: bg, border: `1px solid ${brd}`, color: "#e9ecf5" };
}

function getTagBadgeStyles(tag, fallbackCat = "all") {
  const base = TONE_COLORS[tag] || CAT_COLORS[fallbackCat] || TONE_COLORS.default;
  return {
    background: hexToRgba(base, 0.18),
    border: `1px solid ${hexToRgba(base, 0.30)}`,
    color: "#e9ecf5",
  };
}

function getAuraStyles(tags = [], cat = "all") {
  const toneKey = (Array.isArray(tags) && tags[0]) || null;
  const base = (toneKey && TONE_COLORS[toneKey]) || CAT_COLORS[cat] || TONE_COLORS.default;
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

/* ---------- Categories ---------- */
const CATS = ["all", "earthbeat", "weekly", "feature"];

export default function JournalList() {
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  // Build sorted list with filters/search
  const entries = useMemo(() => {
    let list = [...journalEntries].sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at)
    );
    if (cat !== "all") list = list.filter((e) => e.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          (e.title || "").toLowerCase().includes(q) ||
          (e.summary || "").toLowerCase().includes(q) ||
          (e.tags || []).some((t) => (t || "").toLowerCase().includes(q))
      );
    }
    return list;
  }, [cat, query]);

  // Scroll-reveal observer (unchanged)
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
                style={getPillStyles(c, c === cat)}
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
            style={{ "--reveal-delay": idx, position: "relative", overflow: "hidden" }}
          >
            {/* Aura: tone-based if available, else category tint */}
            <div className="card-aura" style={getAuraStyles(e.tags, e.category)} />

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
                      <span key={t} className="tag" style={getTagBadgeStyles(t, e.category)}>
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
