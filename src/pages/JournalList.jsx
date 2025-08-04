// /src/pages/JournalList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import journalEntries from "../data/journalEntries.json";
import "../styles/journal.css";

/* ---------- Category + tone palette & helpers ---------- */
const CAT_COLORS = {
  earthbeat: "#7fe1a7",
  weekly:    "#93b0ff",
  feature:   "#ffd98a",
  all:       "#9eb6ff",
};

const TONE_COLORS = {
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

/* ---------- Categories & order ---------- */
const CATS = ["earthbeat", "weekly", "feature"];

export default function JournalList() {
	
	  // Read `?cat=` from URL and keep it synced
	const location = useLocation();
	const navigate = useNavigate();

	const initialCat = useMemo(() => {
	  const sp = new URLSearchParams(location.search);
	  const c = sp.get("cat");
	  return CATS.includes(c) ? c : "all";
	}, [location.search]);

	const [cat, setCat] = useState(initialCat);
	const [query, setQuery] = useState("");
	const containerRef = useRef(null);

  
  useEffect(() => {
  const sp = new URLSearchParams(location.search);
  const current = sp.get("cat") || "all";
  if (cat !== current) {
    if (cat === "all") sp.delete("cat");
    else sp.set("cat", cat);
    navigate(
      { pathname: "/journal", search: sp.toString() ? `?${sp}` : "" },
      { replace: true }
    );
  }
}, [cat, location.search, navigate]);

  
  // Build grouped entries: filtered by search, then sorted within each category
  const grouped = useMemo(() => {
    // Search predicate
    const match = (e) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        (e.title || "").toLowerCase().includes(q) ||
        (e.summary || "").toLowerCase().includes(q) ||
        (e.tags || []).some((t) => (t || "").toLowerCase().includes(q))
      );
    };

    // Seed groups
    const base = { earthbeat: [], weekly: [], feature: [] };

    // Fill groups (respecting optional category filter)
    for (const e of journalEntries) {
      if (cat !== "all" && e.category !== cat) continue;
      if (!base[e.category]) continue; // ignore unknown categories
      if (!match(e)) continue;
      base[e.category].push(e);
    }

    // Sort each group newest → oldest
    for (const k of Object.keys(base)) {
      base[k].sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    }
    return base;
  }, [cat, query]);

  // Reveal animation per section
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const els = root.querySelectorAll(".card.reveal");
    const io = new IntersectionObserver(
      (entriesObs) => {
        entriesObs.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [grouped]);

  // Helper to render one category section
  const renderSection = (sectionCat, items) => {
    if (!items || items.length === 0) return null;
    const label =
      sectionCat === "earthbeat" ? "Earthbeat" :
      sectionCat === "weekly"    ? "Weekly Reflections" :
      sectionCat === "feature"   ? "Features" : sectionCat;

    
	
	
	
	
	
	return (
      <section key={sectionCat} className="journal-section">
        <header className="journal-sec-header">
          <h2 className="journal-sec-title">{label}</h2>
          <span className="journal-sec-count">{items.length}</span>
        </header>

        <div className="journal-grid">
          {items.map((e, idx) => (
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
        </div>
      </section>
    );
  };

  return (
    <div className="journal-wrap page-enter" ref={containerRef}>
      <header className="journal-header">
        <h1 className="journal-title">Lumina Journal</h1>
        <p className="journal-sub">Earthbeat • Weekly Reflections • Features</p>

        <div className="journal-controls">
          <div className="pill-group">
            <button
              className={`pill all ${cat === "all" ? "active" : ""}`}
              onClick={() => setCat("all")}
              aria-pressed={cat === "all"}
              style={getPillStyles("all", cat === "all")}
            >
              All
            </button>
            <button
              className={`pill earthbeat ${cat === "earthbeat" ? "active" : ""}`}
              onClick={() => setCat("earthbeat")}
              aria-pressed={cat === "earthbeat"}
              style={getPillStyles("earthbeat", cat === "earthbeat")}
            >
              Earthbeat
            </button>
            <button
              className={`pill weekly ${cat === "weekly" ? "active" : ""}`}
              onClick={() => setCat("weekly")}
              aria-pressed={cat === "weekly"}
              style={getPillStyles("weekly", cat === "weekly")}
            >
              Weekly
            </button>
            <button
              className={`pill feature ${cat === "feature" ? "active" : ""}`}
              onClick={() => setCat("feature")}
              aria-pressed={cat === "feature"}
              style={getPillStyles("feature", cat === "feature")}
            >
              Feature
            </button>
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

      {/* Render grouped sections (or just the selected one) */}
      {cat === "all"
        ? CATS.map((c) => renderSection(c, grouped[c]))
        : renderSection(cat, grouped[cat])}
    </div>
  );
}
