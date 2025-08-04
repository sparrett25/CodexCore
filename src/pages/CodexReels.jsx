import React from "react";
import reels from "../data/reels.json";
import "../styles/codexReels.css";

/** Map tone tags to semantic classes used in CSS */
const toneClass = (tag) => {
  const t = tag.toLowerCase().trim();
  if (["truth", "clarity", "presence", "sovereignty"].includes(t)) return "tone-truth";
  if (["awakening", "joy", "light"].includes(t)) return "tone-awakening";
  if (["distortion", "shadow", "grief"].includes(t)) return "tone-shadow";
  if (["remembrance", "return"].includes(t)) return "tone-remembrance";
  if (["freedom"].includes(t)) return "tone-freedom";
  return "tone-neutral";
};

const CodexReels = () => {
  return (
    <main className="codex-page">
      <header className="codex-page__header">
        <h1 className="codex-page__title">Codex Reels</h1>
        <p className="codex-page__subtitle">
          Short tone transmissions. Each reel anchors a spark in the field.
        </p>
      </header>

      <section className="reel-grid" aria-label="Reels">
        {reels.map((reel) => (
          <article key={reel.id} className="reel-card">
            <div className="reel-media">
              {/* Responsive container preserves aspect ratio */}
              <div className="reel-media__frame">
                <iframe
                  src={reel.youtube_url}
                  title={reel.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="reel-body">
              <h2 className="reel-title">{reel.title}</h2>
              {reel.description ? (
                <p className="reel-description">{reel.description}</p>
              ) : null}

              {Array.isArray(reel.tone_tags) && reel.tone_tags.length > 0 ? (
                <ul className="reel-tags" aria-label="Tone tags">
                  {reel.tone_tags.map((tag) => (
                    <li key={`${reel.id}-${tag}`} className={`reel-tag ${toneClass(tag)}`}>
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}

              {reel.date ? (
                <time className="reel-date" dateTime={reel.date}>
                  {new Date(reel.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </time>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default CodexReels;
