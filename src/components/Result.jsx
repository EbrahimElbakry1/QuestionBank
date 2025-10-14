import React from "react";

export default function Result({ subject, score, total, onAgain }) {
  return (
    <section className="card card--lg" aria-labelledby="result-heading">
      <h2 id="result-heading" className="result-title">Your Result</h2>
      <p className="intro result-intro">
        Subject: <strong>{subject}</strong>
      </p>
      <p className="result-score">You scored {score}/{total}.</p>
      <div className="card__foot">
        <button className="btn" data-variant="primary" onClick={onAgain}>
          Try Another Subject
        </button>
      </div>
    </section>
  );
}
