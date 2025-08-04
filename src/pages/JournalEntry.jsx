import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { journalSample } from "../data/journalSample";
import "../styles/journal.css";

export default function JournalEntry() {
  const { slug } = useParams();
  const entry = useMemo(
    () => journalSample.find((e) => e.slug === slug),
    [slug]
  );

  if (!entry) {
    return (
      <div className="journal-wrap page-enter">
        <p>Not found.</p>
        <Link to="/journal" className="back-link">← Back to Journal</Link>
      </div>
    );
  }

  const related = journalSample
    .filter(
      (e) =>
        e.slug !== entry.slug &&
        e.category === entry.category &&
        (e.tags || []).some((t) => (entry.tags || []).includes(t))
    )
    .slice(0, 3);

  return (
    <div className="journal-wrap page-enter">
      <Link to="/journal" className="back-link">← Back to Journal</Link>

     <article className={`entry ${entry.category}`}>
        <header className="entry-header">
          <span className="badge">{entry.category}</span>
          <h1 className="entry-title">{entry.title}</h1>
          <div className="entry-meta">
            <time>{new Date(entry.published_at).toLocaleString()}</time>
            <div className="tag-row">
              {(entry.tags || []).map((t) => (
                <span key={t} className="tag">{t}</span>
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
          // For now, content is simple HTML. If you prefer Markdown, we can add a renderer.
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />

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
