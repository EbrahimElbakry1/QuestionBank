// src/QuizApp.jsx
import React, { useMemo, useState, useEffect } from "react";
import useAuth from "./hooks/useAuth.js";
import useQuestions from "./hooks/useQuestions.js";
import { supabase } from "./services/supabaseClient.js";
import Auth from "./components/Auth.jsx";
import MistakesPicker from "./components/MistakesPicker.jsx";
import NewQuizSetup from "./components/NewQuizSetup.jsx";
import Quiz from "./components/Quiz.jsx";
import Result from "./components/Result.jsx";
import Header from "./components/Header.jsx";
import "./styles/dashboard.css";

const SUBJECTS = [
  "📐 Mathematics",
  "⚗️ Physics",
  "📚 History",
  "🌍 Geography",
  "🕌 Arabic",
  "🧪 Chemistry",
  "🇬🇧 English",
  "🧠 Biology",
  "📊 Statistics",
];

export default function QuizApp() {
  // ✅ Test Supabase connection
  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from("profile").select("*").limit(1);
        if (error) console.error("❌ Supabase connection failed:", error.message);
        else console.log("✅ Supabase connected successfully!", data);
      } catch (err) {
        console.error("🚨 Unexpected Supabase error:", err);
      }
    }
    testConnection();
  }, []);

  // State management
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

  // ====================== AUTH PAGE ======================
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

  // ====================== MAIN DASHBOARD ======================
  if (screen === "subjects") {
    return (
      <div className="dashboard-page">
        <Header username={displayName} onLogout={() => { logout(); setScreen("auth"); }} />

        <div className="dashboard-container">
          <h2>Welcome back</h2>
          <p>Choose a subject below to start practicing.</p>

          <div className="subject-grid">
            {SUBJECTS.map((subj) => (
              <div
                key={subj}
                className="subject-card"
                onClick={() => pickSubject(subj.replace(/^[^\s]+\s/, ""))} // remove emoji when passing
              >
                {subj}
              </div>
            ))}
          </div>
        </div>

        <footer className="site-footer">
          <small>© {new Date().getFullYear()} Wizara Prep</small>
        </footer>
      </div>
    );
  }

  // ====================== OTHER SCREENS ======================
  return (
    <div className="page">
      {screen === "hub-mode" && (
        <section className="card card--lg" aria-labelledby="mode-heading">
          <h2 id="mode-heading" className="result-title">
            Subject: {subject}
          </h2>
          <div className="card__foot" style={{ justifyContent: "center" }}>
            <button
              className="btn"
              data-variant="primary"
              onClick={() => setScreen("mistakes-setup")}
            >
              Quiz on Past Mistakes
            </button>
            <button
              className="btn"
              data-variant="secondary"
              onClick={() => setScreen("new-setup")}
            >
              Quiz on New Questions
            </button>
          </div>
          <div className="card__foot" style={{ justifyContent: "center" }}>
            <button className="btn" data-variant="ghost" onClick={backToSubjects}>
              Back to Subjects
            </button>
          </div>
        </section>
      )}

      {screen === "mistakes-setup" && subject && (
        <MistakesPicker
          username={displayName}
          subject={subject}
          onBack={() => setScreen("hub-mode")}
          onStart={beginMistakesQuiz}
        />
      )}

      {screen === "new-setup" && subject && (
        <NewQuizSetup
          subject={subject}
          onBack={() => setScreen("hub-mode")}
          onStart={beginNewQuiz}
        />
      )}

      {screen === "quiz" && subject && (
        <Quiz
          username={displayName}
          subject={subject}
          questions={quizSet}
          loading={overrideQuestions?.type === "new" ? loading : false}
          error={error}
          onRetry={refetch}
          onFinish={finishQuiz}
          onBack={() => setScreen("hub-mode")}
          minutes={timerMinutes}
        />
      )}

      {screen === "result" && (
        <Result
          subject={subject}
          score={finalScore}
          total={quizSet.length}
          onAgain={backToSubjects}
        />
      )}
    </div>
  );
}
