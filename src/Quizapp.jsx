// src/QuizApp.jsx
import React, { useMemo, useState, useEffect } from "react";
import useAuth from "./hooks/useAuth.js";
import useQuestions from "./hooks/useQuestions.js";
import { supabase } from "./services/supabaseClient.js";
import Auth from "./components/Auth.jsx";
import SubjectGrid from "./components/SubjectGrid.jsx";
import MistakesPicker from "./components/MistakesPicker.jsx";
import NewQuizSetup from "./components/NewQuizSetup.jsx";
import Quiz from "./components/Quiz.jsx";
import Result from "./components/Result.jsx";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "History",
  "Geography",
  "Arabic",
  "Chemistry",
  "English",
  "Biology",
  "Statistics",
];

export default function QuizApp() {
  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from("profile").select("*").limit(1);
        if (error) console.error("❌ Supabase connection failed:", error.message);
        else console.log("✅ Supabase connected successfully! Sample data:", data);
      } catch (err) {
        console.error("🚨 Unexpected Supabase error:", err);
      }
    }
    testConnection();
  }, []);

  const [screen, setScreen] = useState("auth");
  const [subject, setSubject] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [overrideQuestions, setOverrideQuestions] = useState(null);

  const { user, login, signUp, logout } = useAuth();
  const { data: questions, loading, error, refetch } = useQuestions(subject);

  const handleAuthDone = async (mode, email, password) => {
    try {
      if (mode === "login") await login(email, password);
      else await signUp(email, password);
      setScreen("subjects");
    } catch (e) {
      alert(e.message || "Auth error");
    }
  };

  const pickSubject = (s) => {
    setSubject(s);
    setScreen("hub-mode");
  };

  const beginMistakesQuiz = ({ items, minutes }) => {
    setTimerMinutes(minutes);
    setOverrideQuestions({ type: "mistakes", items });
    setScreen("quiz");
  };

  const beginNewQuiz = ({ count, minutes }) => {
    setTimerMinutes(minutes);
    setOverrideQuestions({ type: "new", count });
    setScreen("quiz");
  };

  const finishQuiz = (score) => {
    setFinalScore(score);
    setScreen("result");
  };

  const backToSubjects = () => {
    setSubject(null);
    setOverrideQuestions(null);
    setFinalScore(0);
    setTimerMinutes(10);
    setScreen("subjects");
  };

  const quizSet = useMemo(() => {
    if (!subject || !overrideQuestions) return [];
    if (overrideQuestions.type === "mistakes") return overrideQuestions.items || [];
    if (overrideQuestions.type === "new")
      return questions.slice(0, overrideQuestions.count || questions.length);
    return questions;
  }, [questions, overrideQuestions, subject]);

  const displayName = user?.email ?? user?.user_metadata?.username ?? "User";

  if (!user || screen === "auth") {
    return (
      <div className="page">
    
        <main className="container">
          <Auth onDone={handleAuthDone} />
        </main>
        <footer className="site-footer">
          <small>© {new Date().getFullYear()} Wizara Prep</small>
        </footer>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="site-header">
        <h1 className="title">Wizara Prep</h1>
        <div style={{ marginTop: 8 }}>
          <small>
            Logged in as <strong>{displayName}</strong> ·{" "}
          </small>
          <button className="btn" data-variant="ghost" onClick={() => { logout(); setScreen("auth"); }}>
            Log out
          </button>
        </div>
      </header>

      <main className="container" aria-live="polite">
        {screen === "subjects" && (
          <section className="card">
            <div className="card__head">
              <div className="wizara">
                <p className="wizara__title">✨ From the <strong>Wizara Question Bank</strong></p>
                <p className="wizara__subtitle">✔ Practice directly with official Wizara questions.</p>
              </div>
            </div>
            <div className="card__body">
              <p className="intro">Pick a subject:</p>
              <SubjectGrid subjects={SUBJECTS} onPick={pickSubject} />
            </div>
          </section>
        )}
      </main>
 
      <footer className="site-footer">
        <small>© {new Date().getFullYear()} Wizara Prep</small>
      </footer>
    </div>
  );
}
