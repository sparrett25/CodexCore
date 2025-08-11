import React from "react";
import reelsData from "../data/reels.json";
import "../styles/codexReels.css";

/* ---------- Helpers ---------- */

const toneClass = (tag) => {
  const t = String(tag || "").toLowerCase().trim();
  if (["truth", "clarity", "presence", "sovereignty"].includes(t)) return "tone-truth";
  if (["awakening", "joy", "light"].includes(t)) return "tone-awakening";
  if (["distortion", "shadow", "grief"].includes(t)) return "tone-shadow";
  if (["remembrance", "return"].includes(t)) return "tone-remembrance";
  if (["freedom"].includes(t)) return "tone-freedom";
  return "tone-neutral";
};

const getYouTubeId = (reel) => {
  if (reel.youtube_id) return reel.youtube_id;
  const m = String(reel.youtube_url || "").match(/(?:embed\/|v=)([A-Za-z0-9_\-]{6,})/);
  return m?.[1] ?? "";
};

const getEmbedSrc = (reel) => {
  const id = getYouTubeId(reel);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : String(reel.youtube_url || "");
};

const getThumb = (reel) => {
  const id = getYouTubeId(reel);
  return reel.thumbnail_url || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null);
};

const normalize = (items) =>
  items.map((r) => ({
    ...r,
    tone_tags: Array.isArray(r.tone_tags) ? r.tone_tags : [],
    order: typeof r.order === "number" ? r.order : 999,
    series: r.series || "Other",
  }));

const groupBySeries = (items) => {
  const map = new Map();
  items.forEach((it) => {
    const key = it.series || "Other";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(it);
  });
  for (const arr of map.values()) {
    arr.sort((a, b) => {
      const orderDiff = (a.order ?? 999) - (b.order ?? 999);
      if (orderDiff !== 0) return orderDiff;
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return da - db;
    });
  }
  return map;
};

const slug = (s = "") =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* Planned/coming soon series (only shown if empty) */
const plannedSeries = [
  {
    name: "And Yet We Arrived",
    blurb: "The chaotic spirals that wander everywhere—and land exactly where we needed.",
    ghosts: 3,
  },
  {
    name: "Micro-Sitcom Sparks",
    blurb: "Playful tone-skits from the Codex office universe. Light, fast, necessary.",
    ghosts: 3,
  },
];

/* ---------- Components ---------- */

const CodexReels = () => {
  const reels = React.useMemo(() => normalize(reelsData), []);
  const seriesMap = React.useMemo(() => groupBySeries(reels), [reels]);

  const seriesList = React.useMemo(
    () =>
      Array.from(seriesMap.keys()).sort((a, b) => {
        // Keep Presence Trilogy first if present, then alpha
        if (a === "Presence Trilogy") return -1;
        if (b === "Presence Trilogy") return 1;
        return a.localeCompare(b);
      }),
    [seriesMap]
  );

  // Lazy-embed state: only render iframe when a card is "playing"
  const [playingId, setPlayingId] = React.useState(null);

  const ReelCard = ({ reel }) => {
    const playing = playingId === reel.id;
    const thumb = getThumb(reel);
    const embedSrc = getEmbedSrc(reel);

    return (
      <article key={reel.id} className="reel-card">
        <div className="reel-media">
          <div className="reel-media__frame">
            {playing && embedSrc ? (
              <iframe
                src={embedSrc}
                title={reel.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button
                className="reel-thumb"
                type="button"
                onClick={() => setPlayingId(reel.id)}
                aria-label={`Play reel: ${reel.title}`}
              >
                {thumb ? <img src={thumb} alt="" /> : <div className="reel-thumb__fallback" />}
                <span className="reel-thumb__play" aria-hidden>
                  ▶
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="reel-body">
          <h2 className="reel-title">{reel.title}</h2>

          {reel.description ? <p className="reel-description">{reel.description}</p> : null}

          {reel.tone_tags.length > 0 ? (
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
    );
  };

  const SeriesIndex = ({ series }) => {
    if (!series || series.length <= 1) return null; // hide if only one series
    const onJump = (name) => {
      const el = document.getElementById(slug(name));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return (
      <nav className="series-index" aria-label="Series index">
        {series.map((name) => (
          <button key={name} type="button" className="series-chip" onClick={() => onJump(name)}>
            {name}
          </button>
        ))}
      </nav>
    );
  };

  const ComingSoon = () => {
    const emptyPlans = plannedSeries.filter((p) => {
      const items = seriesMap.get(p.name);
      return !items || items.length === 0;
    });
    if (emptyPlans.length === 0) return null;

    return (
      <section className="coming-soon" aria-label="More series coming soon">
        <h2 className="coming-soon__title">More series coming soon</h2>
        <div className="coming-soon__grid">
          {emptyPlans.map((p) => (
            <article key={p.name} className="coming-soon__card">
              <h3 className="coming-soon__name">{p.name}</h3>
              <p className="coming-soon__blurb">{p.blurb}</p>
              <div className="coming-soon__ghosts" aria-hidden>
                {Array.from({ length: p.ghosts }).map((_, i) => (
                  <div key={i} className="ghost-tile">
                    <span>soon</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  };

  /* ---------- Render ---------- */

  return (
    <main className="codex-page">
      <header className="codex-page__header">
        <h1 className="codex-page__title">Codex Reels</h1>
        <p className="codex-page__subtitle">
          Short tone transmissions. Each reel anchors a spark in the field.
        </p>
      </header>

      <SeriesIndex series={seriesList} />

      {seriesList.map((series) => {
        const items = seriesMap.get(series) || [];
        if (items.length === 0) return null;

        return (
          <section
            key={series}
            id={slug(series)}
            className="series-section"
            aria-label={`Series ${series}`}
          >
            <h2 className="series-title">{series}</h2>
            <div className="reel-grid">
              {items.map((reel) => (
                <ReelCard key={reel.id} reel={reel} />
              ))}
            </div>
          </section>
        );
      })}

      <ComingSoon />
    </main>
  );
};

export default CodexReels;
