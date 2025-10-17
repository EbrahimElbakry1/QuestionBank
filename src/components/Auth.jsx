import React, { useState } from "react";
import "../styles/auth.css";
import logo from "../assets/logo.png";
import useAuth from "../hooks/useAuth.js";

export default function Auth({ onDone }) {
  const { login, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    if (mode === "login") {
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) return setError(res.message);
      setMessage("✅ Logged in successfully!");
      onDone?.("login", email, password);
    } else {
      const res = await signUp(email, password);
      setLoading(false);
      if (!res.success) return setError(res.message);
      setMessage(res.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <img src={logo} alt="Wizara Prep logo" className="auth-logo" />
        </div>

        <h2 className="auth-title">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>

        <form className="auth-form" onSubmit={submit}>
          <label className="auth-label">
            <input
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            <input
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "LOGIN"
              : "SIGN UP"}
          </button>
        </form>

        {/* Message / Error feedback */}
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}

        <div className="auth-switch">
          {mode === "login" ? (
            <>
              <span>Don’t have an account?</span>
              <button
                type="button"
                className="auth-link"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button
                type="button"
                className="auth-link"
                onClick={() => setMode("login")}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
