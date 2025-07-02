import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";
import SummaryPage from "./pages/SummaryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/errors" element={<ErrorPage />} />
      <Route path="/summary" element={<SummaryPage />} />
    </Routes>
  );
}

export default App;
