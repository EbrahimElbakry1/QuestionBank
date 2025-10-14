import React from "react";

export default function SubjectGrid({ subjects = [], onPick }) {
  return (
    <div className="subject-grid" role="list">
      {subjects.map((s) => (
        <button
          key={s}
          className="subject-btn"
          role="listitem"
          aria-label={`Choose ${s}`}
          onClick={() => onPick(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
