// /src/pages/ScrollGrove.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import scrolls from "../data/scrolls.json";
import "../styles/scrollGrove.css";

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
  const r = parseInt(m[1],16), g = parseInt(m[2],16), b = parseInt(m[3],16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getTagStyles(tag, isActive = false) {
  if (tag === "all") {
    return {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "#e9ecf5",
    };
  }
  const base = TONE_COLORS[tag] || TONE_COLORS.default;
  const bg  = hexToRgba(base, isActive ? 0.28 : 0.16);
  const brd = hexToRgba(base, isActive ? 0.42 : 0.28);
  return { background: bg, border: `1px solid ${brd}`, color: "#e9ecf5" };
}

// NEW: tint badges on cards/detail using the same palette
function getTagBadgeStyles(tag) {
  const base = TONE_COLORS[tag] || TONE_COLORS.default;
  return {
    background: hexToRgba(base, 0.18),
    border: `1px solid ${hexToRgba(base, 0.30)}`,
    color: "#e9ecf5",
  };
}

export default function ScrollGrove() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const containerRef = useRef(null);

  // Build tag counts from tone_tags
  const { tagCounts, sortedTags, total } = useMemo(() => {
    const counts = {};
    let total = 0;
    scrolls.forEach((s) => {
      total += 1;
      (s.tone_tags || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return {
      tagCounts: counts,
      sortedTags: Object.keys(counts).sort((a, b) => a.localeCompare(b)),
      total,
    };
  }, []);

  // Filtered list
  const filteredScrolls = useMemo(() => {
    let list = [...scrolls];
    if (tag !== "all") list = list.filter((s) => s.tone_tags?.includes(tag));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.excerpt || "").toLowerCase().includes(q) ||
          (s.tone_tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [tag, query]);

  // Reveal animation
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const els = root.querySelectorAll(".scroll-card.reveal");
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
  }, [filteredScrolls]);

  return (
    <div className="grove-wrap page-enter">
      <header className="grove-header">
        <h1 className="grove-title">Scroll Grove</h1>
        <p className="grove-sub">A constellation of living scrolls</p>

        <div className="grove-controls">
          {/* Tag legend (filter) */}
          <div className="tag-legend" role="listbox" aria-label="Filter by tone tag">
            <button
              className={`tag-chip all ${tag === "all" ? "active" : ""}`}
              data-tag="all"
              onClick={() => setTag("all")}
              aria-pressed={tag === "all"}
              style={getTagStyles("all", tag === "all")}
            >
              All <span className="count">{total}</span>
            </button>

            {sortedTags.map((t) => (
              <button
                key={t}
                className={`tag-chip ${tag === t ? "active" : ""}`}
                data-tag={t}
                onClick={() => setTag(t)}
                aria-pressed={tag === t}
                style={getTagStyles(t, tag === t)}
                title={`Filter by ${t}`}
              >
                {t} <span className="count">{tagCounts[t]}</span>
              </button>
            ))}
          </div>

          <input
            className="grove-search"
            placeholder="Search scrolls…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search scrolls"
          />
        </div>
      </header>

      <section className="grove-grid" ref={containerRef}>
        {filteredScrolls.map((s, idx) => {
          const slug = s.slug ||
            (s.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

          const primaryTag = (s.tone_tags && s.tone_tags[0]) || "default";
          const auraBase = TONE_COLORS[primaryTag] || TONE_COLORS.default;
          const auraStrong = hexToRgba(auraBase, 0.35);
          const auraSoft   = hexToRgba(auraBase, 0.20);

          return (
            <Link
              key={s.id || s.slug || s.title}
              to={`/scrolls/${slug}`}
              className="scroll-card reveal"
              data-tag={primaryTag}
              style={{ "--reveal-delay": idx, display: "block", textDecoration: "none", color: "inherit" }}
            >
              {/* Aura layer behind card content */}
              <div
                className="card-aura"
                style={{
                  background: `
                    radial-gradient(360px 140px at 18% 0%, ${auraStrong}, transparent 70%),
                    radial-gradient(520px 200px at 82% 0%, ${auraSoft}, transparent 72%)
                  `
                }}
              />

              <div className="scroll-card-inner">
                <div className="scroll-header">
                  <div className="tag-list">
                    {(s.tone_tags || []).map((t) => (
                      <span
                        key={t}
                        className="tag-badge"
                        data-tag={t}
                        style={getTagBadgeStyles(t)}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="scroll-title">{s.title}</h3>
                {s.excerpt && <p className="scroll-summary">{s.excerpt}</p>}
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
