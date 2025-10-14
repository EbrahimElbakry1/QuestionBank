import React, { useMemo, useState } from "react";
import { getMistakes } from "../utils/userStore.js";

export default function MistakesPicker({ username, subject, onBack, onStart }) {
  // All saved mistakes for this user+subject
  const all = useMemo(() => getMistakes(username, subject), [username, subject]); // [{id, question, choices, answerIndex}]

  // By default select all
  const [selected, setSelected] = useState(() => new Set(all.map((q) => q.id)));
  const [minutes, setMinutes] = useState(10);

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  // Build the concrete list of selected question objects
  const selectedItems = useMemo(
    () => all.filter((q) => selected.has(q.id)),
    [all, selected]
  );

  return (
    <section className="card card--lg" aria-labelledby="mistakes-heading">
      <h2 id="mistakes-heading" className="result-title">Practice Past Mistakes</h2>
      <p className="intro">Subject: <strong>{subject}</strong></p>

      {all.length === 0 ? (
        <p>No mistakes saved yet for this subject.</p>
      ) : (
        <div className="card__body scrollable">
          {all.map((q) => (
            <label
              key={q.id}
              className="btn"
              style={{ display: "block", textAlign: "left", marginBottom: 8 }}
            >
              <input
                type="checkbox"
                checked={selected.has(q.id)}
                onChange={() => toggle(q.id)}
                style={{ marginRight: 10 }}
              />
              {q.question}
            </label>
          ))}
        </div>
      )}

      <div
        className="card__body"
        style={{ display: "flex", gap: 10, justifyContent: "center" }}
      >
        <label className="intro">
          Timer (minutes):&nbsp;
          <input
            type="number"
            min="1"
            value={minutes}
            onChange={(e) => setMinutes(Math.max(1, Number(e.target.value)))}
            className="btn"
            style={{ width: 100, textAlign: "left" }}
          />
        </label>
      </div>

      <div className="card__foot" style={{ justifyContent: "center" }}>
        <button className="btn" data-variant="ghost" onClick={onBack}>
          Back
        </button>
        <button
          className="btn"
          data-variant="primary"
          onClick={() => onStart({ items: selectedItems, minutes })}
          disabled={selectedItems.length === 0}
        >
          Start
        </button>
      </div>
    </section>
  );
}
