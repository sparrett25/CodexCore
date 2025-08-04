// /src/pages/JournalEntry.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import journalEntries from "../data/journalEntries.json";
import "../styles/journal.css";

/* ---------- Category + tone palette & helpers (match JournalList) ---------- */
const CAT_COLORS = {
  earthbeat: "#7fe1a7",
  weekly: "#93b0ff",
  feature: "#ffd98a",
  all: "#9eb6ff",
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

/* ---------- Component ---------- */
export default function JournalEntry() {
  const { slug } = useParams();

  // Find the entry
  const entry = useMemo(() => journalEntries.find((e) => e.slug === slug), [slug]);

  if (!entry) {
    return (
      <div className="journal-wrap page-enter">
        <p>Not found.</p>
        <Link to="/journal" className="back-link">← Back to Journal</Link>
      </div>
    );
  }

  // Sorted list within same category (newest → oldest)
  const siblings = useMemo(() => {
    return journalEntries
      .filter((e) => e.category === entry.category)
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  }, [entry?.category]); // guard for first render

  // Locate current entry and compute neighbors
  const idx = siblings.findIndex((e) => e.slug === entry.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;                           // previous (newer)
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null; // next (older)

  // Related (unchanged)
  const related = journalEntries
    .filter(
      (e) =>
        e.slug !== entry.slug &&
        e.category === entry.category &&
        (e.tags || []).some((t) => (entry.tags || []).includes(t))
    )
    .slice(0, 3);

  const primaryTags = entry.tags || [];
  const entryClass = `entry ${entry.category}`;

  return (
    <div className="journal-wrap page-enter">
      <Link
  to={`/journal?cat=${entry.category}`}
  className="back-chip"
  aria-label={`Back to ${entry.category} entries`}
>
  ← Back to {entry.category === "earthbeat" ? "Earthbeat" :
             entry.category === "weekly"    ? "Weekly"    :
             entry.category === "feature"   ? "Feature"   : entry.category}
</Link>

      <article className={entryClass}>
        <header
          className="entry-header"
          style={{ position: "relative", overflow: "hidden" }}
        >
          {/* Aura behind the header */}
          <div className="card-aura" style={getAuraStyles(primaryTags, entry.category)} />

          <span className="badge">{entry.category}</span>
          <h1 className="entry-title">{entry.title}</h1>

          <div className="entry-meta">
            <time dateTime={entry.published_at}>
              {new Date(entry.published_at).toLocaleString()}
            </time>
            <div className="tag-row">
              {(entry.tags || []).map((t) => (
                <span key={t} className="tag" style={getTagBadgeStyles(t, entry.category)}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </header>

        {entry.cover_image_url && (
          <div className="entry-hero">
            <img src={entry.cover_image_url} alt={entry.title} />
          </div>
        )}

        <section
          className="entry-content"
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />

        {/* Prev / Next within same category */}
        {(prev || next) && (
          <nav className="entry-pagination" aria-label="Entry navigation">
            <div className="nav-left">
              {prev && (
                <Link to={`/journal/${prev.slug}`} className="nav-link prev">← Newer: {prev.title}</Link>
              )}
            </div>
            <div className="nav-right">
              {next && (
                <Link to={`/journal/${next.slug}`} className="nav-link next">Older: {next.title} →</Link>
              )}
            </div>
          </nav>
        )}

        {related.length > 0 && (
          <section className="related">
            <h3>Related</h3>
            <div className="related-row">
              {related.map((r) => (
                <Link key={r.slug} to={`/journal/${r.slug}`} className="related-card">
                  <div className="mini-thumb">
                    {r.cover_image_url ? (
                      <img src={r.cover_image_url} alt={r.title} />
                    ) : (
                      <div className="thumb-fallback" />
                    )}
                  </div>
                  <div>
                    <div className="related-title">{r.title}</div>
                    <div className="related-date">
                      {new Date(r.published_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
