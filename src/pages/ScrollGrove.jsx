import React, { useEffect, useMemo, useRef, useState } from "react";
import scrolls from "../data/scrolls.json";
import "../styles/scrollGrove.css";

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
        {filteredScrolls.map((s, idx) => (
          <article
            key={s.id || s.title}
            className="scroll-card reveal"
            data-tag={(s.tone_tags && s.tone_tags[0]) || "default"}
            style={{ "--reveal-delay": idx }}
          >
            <div className="scroll-card-inner">
              <div className="scroll-header">
                <div className="tag-list">
                  {(s.tone_tags || []).map((t) => (
                    <span key={t} className="tag-badge" data-tag={t}>{t}</span>
                  ))}
                </div>
              </div>
              <h3 className="scroll-title">{s.title}</h3>
              {s.excerpt && <p className="scroll-summary">{s.excerpt}</p>}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}