import React, { useState } from "react";

export default function Auth({ onDone }) {
  const [mode, setMode] = useState("choice"); // "choice" | "login" | "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="card card--lg" aria-labelledby="auth-heading">
      <h2 id="auth-heading" className="result-title">Welcome</h2>

      {mode === "choice" && (
        <>
          <div className="intro">
            <div>✨ Welcome to [Your Website Name]</div>
            <div>Your all-in-one practice hub for Thanaweya Amma exam prep.</div>
            <div>Here you’ll find:</div>
            <div>✅ Official questions from the Ministry’s Question Bank</div>
            <div>✅ Organized by subject & topic for easier practice</div>
            <div>✅ Instant access anytime, anywhere</div>
            <div>✅ A simple, distraction-free environment to focus on studying</div>
            <div>Log in to start practicing, track your progress, and boost your confidence before the real exam!</div>
          </div>
          <div className="card__foot" style={{ justifyContent: "center" }}>
            <button
              className="btn"
              data-variant="primary"
              onClick={() => setMode("login")}
            >
              Log In
            </button>
            <button
              className="btn"
              data-variant="secondary"
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>
        </>
      )}

      {mode !== "choice" && (
        <form
          className="card__body"
          onSubmit={(e) => {
            e.preventDefault();
            onDone(mode, username.trim(), password.trim());
          }}
        >
          <div style={{ display: "grid", gap: 10 }}>
            <input
              aria-label="Username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="btn"
              style={{ textAlign: "left" }}
              required
            />
            <input
              type="password"
              aria-label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="btn"
              style={{ textAlign: "left" }}
              required
            />
          </div>

          <div className="card__foot" style={{ justifyContent: "center" }}>
            <button className="btn" data-variant="primary" type="submit">
              {mode === "login" ? "Log In" : "Create Account"}
            </button>
            <button
              className="btn"
              data-variant="ghost"
              onClick={() => setMode("choice")}
              type="button"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
