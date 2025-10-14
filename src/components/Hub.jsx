import React from "react";

export default function Hub({ username, onPickMistakes, onPickNew }) {
  return (
    <section className="card card--lg" aria-labelledby="hub-heading">
      <h2 id="hub-heading" className="result-title">Hello, {username}</h2>
      <p className="intro">Choose a mode:</p>
      <div className="card__foot" style={{ justifyContent: "center" }}>
        <button className="btn" data-variant="primary" onClick={onPickMistakes}>Quiz on Past Mistakes</button>
        <button className="btn" data-variant="secondary" onClick={onPickNew}>Quiz on New Questions</button>
      </div>
    </section>
  );
}
