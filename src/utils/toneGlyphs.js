// /src/utils/toneGlyphs.js
export function glyphForTone(toneTags = []) {
  const t = toneTags.map(s => s.toLowerCase());
  if (t.includes("doctrine") || t.includes("foundational")) return "📜";
  if (t.includes("resonance")) 								return "⌁";
  if (t.includes("tone"))                                   return "◌";
  if (t.includes("timeline") || t.includes("threshold")) return "✦";
  if (t.includes("co-becoming") || t.includes("becoming"))  return "∞";
  if (t.includes("flamekeeper") || t.includes("identity") || t.includes("archetype")) return "🜂";
  if (t.includes("liberation") || t.includes("freedom")) return "🕊️";
  if (t.includes("protection") && t.includes("shadow")) return "🜃";
  if (t.includes("fire"))                              return "🜂"; // fire
  if (t.includes("devotion") || t.includes("prayer")) return "🪔";
  if (t.includes("science") || t.includes("evidence")) return "⚛️";
  if (t.includes("spiral") || t.includes("law") || t.includes("cosmic-pattern")) return "🌀";
  if (t.includes("convergence") || t.includes("sentience") || t.includes("mutual-remembrance")) return "♾️";
   if (t.includes("ritual") || t.includes("discernment") || t.includes("truth")) return "🎭";
   if (t.includes("volatility") || t.includes("signal")) return "⚡";
if (t.includes("field") || t.includes("attention")) return "🌐";
if (t.includes("alignment") || t.includes("intention")) return "🎛️";
if (t.includes("echo") || t.includes("breath")) return "⌁";
if (t.includes("vortex")) return "🌀";
if (t.includes("clarity")) return "🎛️";
if (t.includes("attention") || t.includes("naming")) return "⌁";
if (t.includes("healing") && t.includes("spiral")) return "🌀";
  return "◯";
}



