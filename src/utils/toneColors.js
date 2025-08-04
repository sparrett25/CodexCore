// Shared tone palette + helpers
export const TONE_COLORS = {
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

export function hexToRgba(hex, alpha = 1) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(158,182,255,${alpha})`;
  const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getTagBadgeStyles(tag) {
  const base = TONE_COLORS[tag] || TONE_COLORS.default;
  return {
    background: hexToRgba(base, 0.18),
    border: `1px solid ${hexToRgba(base, 0.30)}`,
    color: "#e9ecf5",
  };
}

export function getTagPillStyles(tag, isActive = false) {
  if (tag === "all") {
    return {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "#e9ecf5",
    };
  }
  const base = TONE_COLORS[tag] || TONE_COLORS.default;
  return {
    background: hexToRgba(base, isActive ? 0.28 : 0.16),
    border: `1px solid ${hexToRgba(base, isActive ? 0.42 : 0.28)}`,
    color: "#e9ecf5",
  };
}
