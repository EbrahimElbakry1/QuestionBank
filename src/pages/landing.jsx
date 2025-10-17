import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import heroImg from "../assets/img.png"; 
import logo from "../assets/logo.png";


export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* HEADER */}
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Wizara Prep logo" />
  
        </div>
        <button className="btn-login" onClick={() => navigate("/app")}>
          Log In
        </button>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>Ace your exams with confidence</h1>
          <p>
            Practice real exam questions, track your progress, and master your
            weak spots — all in one place.
          </p>
          <a href="#how" className="btn-primary">
            Learn More
          </a>
        </div>
        <div className="hero-img">
          <img src={heroImg} alt="Student preparing for exam" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how-it-works">
        <h2>How Wizara Prep Works</h2>
        <div className="steps">
          <div className="step">
            <span>1️⃣</span>
            <h3>Practice</h3>
            <p>Access real exam questions by subject and topic.</p>
          </div>
          <div className="step">
            <span>2️⃣</span>
            <h3>Track</h3>
            <p>Monitor mistakes and progress automatically.</p>
          </div>
          <div className="step">
            <span>3️⃣</span>
            <h3>Improve</h3>
            <p>Focus on your weak areas and boost your confidence.</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="why">
        <h2>Why Choose Wizara Prep</h2>
        <div className="features">
          <div className="feature">💯 100% real exam questions</div>
          <div className="feature">📊 Smart analytics</div>
          <div className="feature">🌍 Accessible anytime, anywhere</div>
          <div className="feature">🎁 100% free</div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta">
        <h2>Ready to start practicing?</h2>
        <p>Join thousands of students boosting their exam performance.</p>
        <button className="btn-primary" onClick={() => navigate("/app")}>
          Start Practicing Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <small>© {new Date().getFullYear()} Wizara Prep</small>
      </footer>
    </div>
  );
}
