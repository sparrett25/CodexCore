import React from 'react';
import { Routes, Route } from 'react-router-dom';

import CodexCore from './pages/CodexCore';
import Landing from "./pages/Landing";


import ScrollGrove from './pages/ScrollGrove';
import ScrollDetail from "./pages/ScrollDetail.jsx";

import CodexReels from './pages/CodexReels';

import JournalList from "./pages/JournalList";
import JournalEntry from "./pages/JournalEntry";
import AboutLumina from "./pages/AboutLumina";
import Ember from "./pages/Ember";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
	  <Route path="/core" element={<CodexCore />} />
      <Route path="/scrolls" element={<ScrollGrove />} />
	  <Route path="/scrolls/:slug" element={<ScrollDetail />} />
	  <Route path="/reels" element={<CodexReels />} />
	  <Route path="/journal" element={<JournalList />} />
	<Route path="/journal/:slug" element={<JournalEntry />} />
	<Route path="/about" element={<AboutLumina />} />
	<Route path="/ember" element={<Ember />} />
	
    </Routes>
  );
}

export default App;
