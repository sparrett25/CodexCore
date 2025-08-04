// CodexCore.jsx
import React, { useState } from "react";
import { codexModules } from "../data/codexModules";
import { useNavigate } from "react-router-dom";
import "../styles/codexCore.css";

const CodexCore = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(null);
  const [transitionOn, setTransitionOn] = useState(false);

  const handleModuleClick = (mod) => {
    if (mod.status !== "live") return;
    setActiveKey(mod.key);          // show ripple on this node
    setTransitionOn(true);          // show full-screen fade
    // allow animations to play before route change
    setTimeout(() => navigate(mod.route), 420);
  };

  return (
    <div className="codex-core-container">
      {/* transition overlay */}
      <div className={`page-transition ${transitionOn ? "active" : ""}`} />

      <div className="codex-core-spiral" />
      <div
        className="codex-core-center"
        onClick={() => {
          console.log("Codex Core clicked — future pulse portal");
        }}
      >
        Codex Core
      </div>

      {codexModules.map((mod) => (
        <div
          key={mod.key}
          data-key={mod.key}
          className={`module-node ${mod.second_orbit ? "second-orbit" : "core-orbit"} ${
            mod.status === "coming_soon" ? "disabled" : ""
          }`}
          style={{ top: `${mod.position.y}%`, left: `${mod.position.x}%` }}
          onClick={() => handleModuleClick(mod)}
        >
          <div className="module-glyph">
            <img
  src={`/assets/celestialGlyphs/${mod.glyph}.svg`}   // or use import.meta.env.BASE_URL as above
  alt={mod.title}
  className="glyph-img"
  draggable="false"
/>

          </div>
          <div className="module-title">{mod.title}</div>

          {/* click ripple (only on the active node) */}
          {activeKey === mod.key && <span className="ripple" />}
        </div>
      ))}
    </div>
  );
};

export default CodexCore;
