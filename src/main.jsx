import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing.jsx";
import QuizApp from "./Quizapp.jsx"; // renamed your quiz logic
import "./styles/styles.css";
import "./styles/landing.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Quiz App */}
        <Route path="/app/*" element={<QuizApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
