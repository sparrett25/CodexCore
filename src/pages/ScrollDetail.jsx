// /src/pages/ScrollDetail.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import scrolls from "../data/scrolls.json";
import "../styles/scrollGrove.css"; // reuse existing typography/badges


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
  constellation: "#b49cff",   // ← added
  default: "#9eb6ff"
};



function hexToRgba(hex, alpha = 1) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(158,182,255,${alpha})`; // fallback
  const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


// Lightweight, built-in Markdown renderer (headings, bold/italic, links, lists, paragraphs)
function renderMarkdown(md = "") {
  let html = md.trim();

  // Escape HTML
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Headings ###### … #
  html = html.replace(/^######\s?(.*)$/gm, "<h6>$1</h6>")
             .replace(/^#####\s?(.*)$/gm, "<h5>$1</h5>")
             .replace(/^####\s?(.*)$/gm, "<h4>$1</h4>")
             .replace(/^###\s?(.*)$/gm, "<h3>$1</h3>")
             .replace(/^##\s?(.*)$/gm, "<h2>$1</h2>")
             .replace(/^#\s?(.*)$/gm, "<h1>$1</h1>");

  // Bold **text** and Italic *text*
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
             .replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links [text](url)
  html = html.replace(/\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Unordered lists
  html = html.replace(/^(?:\s*[-*]\s.+\n?)+/gm, block => {
    const items = block.trim().split(/\n/).map(line => line.replace(/^\s*[-*]\s/, "").trim());
    return `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
  });

  // Paragraphs: wrap remaining lines that aren't already block elements
  html = html.replace(/^(?!<h\d|<ul|<\/ul>|<li|<\/li>)(.+)$/gm, "<p>$1</p>");

  return html;
}

export default function ScrollDetail() {
  const { slug } = useParams();

  // Sort all scrolls by date (desc) once for navigation
  const sorted = useMemo(() => {
    return [...scrolls].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  // Find the scroll by explicit slug (preferred), then fallback to id/title-derived slug if needed
  const scroll = useMemo(() => {
    const bySlug = scrolls.find((s) => s.slug === slug);
    if (bySlug) return bySlug;

    // Fallbacks (helpful while migrating)
    const fallback = scrolls.find((s) => {
      const derived =
        (s.title || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      return derived === slug || s.id === slug;
    });
    return fallback || null;
  }, [slug]);

  if (!scroll) {
    return (
      <main className="grove-container" style={{ paddingTop: "2rem" }}>
        <p style={{ opacity: 0.9 }}>Scroll not found.</p>
        <p>
          <Link to="/scrolls">← Back to Scroll Grove</Link>
        </p>
      </main>
    );
  }

  const { title, tone_tags = [], date, body, body_md, excerpt } = scroll;
  
  const primaryTag = (scroll.tone_tags && scroll.tone_tags[0]) || "default";
  const aura = TONE_COLORS[primaryTag] || TONE_COLORS.default;
  const auraStrong = hexToRgba(aura, 0.35);
  const auraSoft   = hexToRgba(aura, 0.20);

  // Compute Prev/Next based on position in sorted
  const idx = sorted.findIndex(s => s.slug === scroll.slug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return (
     <main className="page-dark grove-container scroll-detail" style={{ paddingTop: "2rem", ["--aura"]: aura }}>
      <p>
        <Link to="/scrolls">← Back to Scroll Grove</Link>
      </p>

      <header className="scroll-detail-header">
	  <div
    className="aura"
    style={{
      background: `
        radial-gradient(700px 260px at 18% 0%, ${auraStrong}, transparent 70%),
        radial-gradient(900px 320px at 82% 0%, ${auraSoft}, transparent 72%)
      `
    }}
  />
        <h1 className="scroll-title" style={{ marginBottom: ".25rem" }}>{title}</h1>
        {date && (
          <div className="scroll-meta" style={{ opacity: 0.8, marginBottom: "0.75rem" }}>
            <time dateTime={date}>
              {new Date(date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        )}
        <div className="tag-list" style={{ marginBottom: "1rem" }}>
          {tone_tags.map((t) => (
            <span key={t} className="tag-badge" data-tag={t}>{t}</span>
          ))}
        </div>
      </header>

      <article className="scroll-body">
        {body ? (
          <div dangerouslySetInnerHTML={{ __html: body }} />
        ) : body_md ? (
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(body_md) }} />
        ) : (
          <p style={{ opacity: 0.95 }}>{excerpt || "This scroll’s body is coming soon."}</p>
        )}
      </article>

      {(prev || next) && (
        <nav
          className="scroll-pagination"
          style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "space-between" }}
        >
          <div>
            {prev && (
              <Link to={`/scrolls/${prev.slug}`} className="nav-link">← {prev.title}</Link>
            )}
          </div>
          <div style={{ marginLeft: "auto" }}>
            {next && (
              <Link to={`/scrolls/${next.slug}`} className="nav-link">{next.title} →</Link>
            )}
          </div>
        </nav>
      )}
    </main>
  );
}
