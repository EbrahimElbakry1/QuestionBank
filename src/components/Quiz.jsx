import React, { useEffect, useMemo, useRef, useState } from "react";
import { addMistakes } from "../utils/userStore.js";

export default function Quiz({
  username,
  subject,
  questions,          // array [{id,question,choices[],answerIndex}]
  loading,
  error,
  onRetry,
  onFinish,
  onBack,
  minutes = 10        // timer length
}) {
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const q = useMemo(() => questions[index], [questions, index]);
  const used = useRef([]);        // track the actual questions shown
  const wrongs = useRef([]);      // collect wrong answers

  useEffect(() => { setIndex(0); setScore(0); setLocked(false); }, [subject, total]);
  useEffect(() => { setTimeLeft(minutes * 60); }, [minutes, subject]);

  // track used questions list
  useEffect(() => {
    if (q && !used.current.find(x => x.id === q.id)) used.current.push(q);
  }, [q]);

  // countdown
  useEffect(() => {
    if (!total) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          finish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [total]);

  const handleAnswer = (i) => {
    if (locked || !q) return;
    setLocked(true);
    const correct = i === q.answerIndex;
    if (correct) setScore((s) => s + 1);
    else wrongs.current.push(q);
  };

  const next = () => {
    const nextIdx = index + 1;
    if (nextIdx >= total) finish();
    else { setIndex(nextIdx); setLocked(false); }
  };

  const finish = () => {
    // persist wrongs to the user's mistakes for this subject
    if (username && subject && wrongs.current.length) {
      addMistakes(username, subject, wrongs.current);
    }
    onFinish(score);
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  return (
    <section className="card card--lg" aria-labelledby="quiz-heading">
      <div className="card__head">
        <h2 id="quiz-heading" className="sr-only">Quiz</h2>
        <div className="stats">
          <div className="stat"><span className="stat__label">Subject</span><span className="stat__value">{subject || "—"}</span></div>
          <div className="stat"><span className="stat__label">Question</span><span className="stat__value">{total ? Math.min(index + 1, total) : 0}/{total}</span></div>
          <div className="stat"><span className="stat__label">Score</span><span className="stat__value">{score}</span></div>
          <div className="stat"><span className="stat__label">Timer</span><span className="stat__value">{mm}:{ss}</span></div>
        </div>
        <div className="progress" aria-label="Progress">
          <div className="progress__bar" style={{ "--value": `${total ? Math.round((index / total) * 100) : 0}%` }} />
        </div>
      </div>

      <div className="card__body">
        {loading && <p>Loading questions…</p>}
        {!loading && error && (
          <>
            <p>Couldn’t load questions. Please try again.</p>
            <button className="btn" data-variant="secondary" onClick={onRetry}>Retry</button>
          </>
        )}
        {!loading && !error && total === 0 && <p>No questions available.</p>}
        {!loading && !error && total > 0 && q && (
          <>
            <p className="question">{q.question}</p>
            <div className="answers" role="group" aria-label="Choices">
              {q.choices.map((c, i) => {
                let state = "";
                if (locked && i === q.answerIndex) state = "correct";
                return (
                  <button
                    key={i}
                    className="btn answer"
                    data-state={state}
                    onClick={() => handleAnswer(i)}
                    disabled={locked}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="card__foot" style={{ justifyContent: "center" }}>
        <button className="btn" data-variant="ghost" onClick={onBack}>Back</button>
        <button className="btn" data-variant="secondary" onClick={next} disabled={loading || !!error || total === 0}>
          {index + 1 >= total ? "Finish" : "Next"}
        </button>
      </div>
    </section>
  );
}
