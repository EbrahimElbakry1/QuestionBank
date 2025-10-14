import React, { useState } from "react";

export default function NewQuizSetup({ subject, onBack, onStart }) {
  const [count, setCount] = useState(10);
  const [minutes, setMinutes] = useState(10);

  return (
    <section className="card card--lg" aria-labelledby="newquiz-heading">
      <h2 id="newquiz-heading" className="result-title">New Questions</h2>
      <p className="intro">Subject: <strong>{subject}</strong></p>

      <div className="card__body" style={{ display: "grid", gap: 12, justifyItems: "center" }}>
        <label className="intro">
          Number of Questions:&nbsp;
          <input
            type="number"
            min="1"
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
            className="btn" style={{ width: 100, textAlign: "left" }}
          />
        </label>

        <label className="intro">
          Timer (minutes):&nbsp;
          <input
            type="number"
            min="1"
            value={minutes}
            onChange={(e) => setMinutes(Math.max(1, Number(e.target.value)))}
            className="btn" style={{ width: 100, textAlign: "left" }}
          />
        </label>
      </div>

      <div className="card__foot" style={{ justifyContent: "center" }}>
        <button className="btn" data-variant="ghost" onClick={onBack}>Back</button>
        <button className="btn" data-variant="primary" onClick={() => onStart({ count, minutes })}>Start</button>
      </div>
    </section>
  );
}
