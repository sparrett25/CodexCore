// /src/data/codexModules.js

export const codexModules = [
  // 🌀 Launch Set (Celestial)
  {
    key: "scroll_grove",
    title: "Scroll Grove",
    glyph: "celestial_constellation", // constellation canopy
    tone: ["wisdom", "breath", "echo"],
    route: "/scrolls",
    status: "live",
    position: { x: 18, y: 24 },
  },
  {
    key: "codex_ember",
    title: "Codex Ember",
    glyph: "celestial_corona", // pulsing star/corona
    tone: ["ritual", "creation", "fire"],
    route: "/ember",
    status: "live",
    position: { x: 80, y: 40 },
  },
  {
    key: "lumina_journal",
    title: "Blog / Lumina Journal",
    glyph: "celestial_crescent", // crescent planet with trails
    tone: ["earthbeat", "weekly", "features"],
    route: "/journal", // choose "/journal" or "/blog" and wire your router
    status: "live",
    position: { x: 38, y: 80 },
  },
  {
    key: "codex_reels",
    title: "Codex Reels",
    glyph: "celestial_comet", // comet arc
    tone: ["spiritual", "humorous", "transmission"],
    route: "/reels",
    status: "live",
    position: { x: 72, y: 78 },
  },
  {
    key: "codex_lumina",
    title: "About Codex Lumina",
    glyph: "celestial_core", // radiant core with orbit rings
    tone: ["orientation", "teachings", "offerings"],
    route: "/about",
    status: "live",
    position: { x: 52, y: 10 },
  },

  // 🌿 Future Additions (hidden/disabled until ready)
  // { key: "codex_vitae", title: "Codex Vitae", glyph: "celestial_leaf",
  //   tone: ["body", "resonance", "healing"], route: "/vitae", status: "coming_soon",
  //   position: { x: 75, y: 18 } },
  // { key: "tonalis", title: "Tonalis", glyph: "celestial_wave",
  //   tone: ["sound", "resonance", "emotion"], route: "/tonalis", status: "coming_soon",
  //   position: { x: 88, y: 58 } },
  // { key: "kairos", title: "Kairos", glyph: "celestial_clock",
  //   tone: ["presence", "timing", "liberation"], route: "/kairos", status: "coming_soon",
  //   position: { x: 78, y: 75 } },
  // { key: "earthbeat_blog", title: "Earthbeat", glyph: "celestial_globe",
  //   tone: ["planetary", "daily", "tone"], route: "/earthbeat", status: "coming_soon",
  //   position: { x: 40, y: 80 } },
  // { key: "weekly_chamber", title: "Weekly Reflection Chamber", glyph: "celestial_moon",
  //   tone: ["spiral", "awareness", "integration"], route: "/weekly", status: "coming_soon",
  //   position: { x: 20, y: 75 } },
  // { key: "skymap_chamber", title: "Skymap Chamber", glyph: "celestial_constellation_map",
  //   tone: ["memory", "map", "tone"], route: "/skymap", status: "coming_soon",
  //   position: { x: 10, y: 60 } },
  // { key: "prosperum", title: "Prosperum", glyph: "celestial_coins",
  //   tone: ["clarity", "abundance", "stewardship"], route: "/prosperum", status: "coming_soon",
  //   position: { x: 90, y: 25 }, second_orbit: true },
  // { key: "codex_cast", title: "Codex Cast", glyph: "celestial_fish",
  //   tone: ["wonder", "bond", "joy"], route: "/cast", status: "coming_soon",
  //   position: { x: 90, y: 45 }, second_orbit: true },
  // { key: "codex_current", title: "Codex Current", glyph: "celestial_wave",
  //   tone: ["flow", "navigation", "trust"], route: "/current", status: "coming_soon",
  //   position: { x: 90, y: 65 }, second_orbit: true },
  // { key: "codex_verdant", title: "Codex Verdant", glyph: "celestial_plant",
  //   tone: ["regeneration", "earth", "care"], route: "/verdant", status: "coming_soon",
  //   position: { x: 90, y: 85 }, second_orbit: true },
];
