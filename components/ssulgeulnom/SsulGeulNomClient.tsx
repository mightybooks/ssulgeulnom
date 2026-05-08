"use client";

import { useState } from "react";
import { DIAGNOSIS_URL, WORKSHOP_URL } from "@/constants/urls";
import {
  ANSWER_OPTIONS,
  QUESTIONS,
  RESULTS,
  type Answer,
  type ResultType,
  type Step,
} from "@/data/ssulgeulnom";
import { calcResult, createInitialScores } from "@/lib/ssulgeulnom/scoring";
import {
  copyTextToClipboard,
  shareResult,
  shareToKakao,
} from "@/lib/ssulgeulnom/share";

function openWorkshop() {
  window.open(WORKSHOP_URL, "_blank", "noopener,noreferrer");
}

function openDiagnosis() {
  window.open(DIAGNOSIS_URL, "_blank", "noopener,noreferrer");
}

export default function SsulGeulNomClient() {
  const [step, setStep] = useState<Step>("start");
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState<Record<ResultType, number>>(
    createInitialScores
  );
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [resultType, setResultType] = useState<ResultType | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const currentQ = QUESTIONS[qIndex];

  function markCopied() {
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 2000);
  }

  function handleAnswer(score: Answer) {
    const nextAnswers = [...answers, score];
    const newScores = {
      ...scores,
      [currentQ.resultType]: scores[currentQ.resultType] + score,
    };

    setAnswers(nextAnswers);
    setScores(newScores);

    if (qIndex < QUESTIONS.length - 1) {
      setAnimKey((k) => k + 1);
      setQIndex(qIndex + 1);
    } else {
      const result = calcResult(newScores, nextAnswers);
      setResultType(result);
      setStep("result");
    }
  }

  async function handleShare() {
    if (!resultType) return;

    try {
      const outcome = await shareResult(RESULTS[resultType], window.location.href);
      if (outcome === "copied") {
        markCopied();
      }
    } catch {
      await handleCopyLink();
    }
  }

  async function handleKakaoShare() {
    if (!resultType) return;

    try {
      const outcome = await shareToKakao(
        RESULTS[resultType],
        resultType,
        window.location.href
      );
      if (outcome === "copied") {
        markCopied();
      }
    } catch {
      await handleCopyLink();
    }
  }

  async function handleCopyLink() {
    await copyTextToClipboard(window.location.href);
    markCopied();
  }

  function restart() {
    setStep("start");
    setQIndex(0);
    setScores(createInitialScores());
    setAnswers([]);
    setResultType(null);
    setCopyDone(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

        :root {
          --bg: #0e0e0e;
          --ink: #f0ede6;
          --ink-dim: #8a8680;
          --accent: #e8c84a;
          --accent-dim: #b89d32;
          --card: #1a1a1a;
          --border: #2e2e2e;
          --serif: 'Noto Serif KR', serif;
          --sans: 'Noto Sans KR', sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--ink);
          font-family: var(--sans);
          min-height: 100dvh;
        }

        .page {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px;
          max-width: 480px;
          margin: 0 auto;
          position: relative;
        }

        .page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .content { position: relative; z-index: 1; width: 100%; }

        .brand {
          font-family: var(--serif);
          font-size: 13px;
          letter-spacing: 0.15em;
          color: var(--ink-dim);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .title-main {
          font-family: var(--serif);
          font-size: clamp(36px, 10vw, 52px);
          font-weight: 900;
          line-height: 1.1;
          color: var(--ink);
        }

        .title-accent {
          color: var(--accent);
          display: block;
        }

        .subtitle {
          font-size: 15px;
          color: var(--ink-dim);
          margin-top: 16px;
          line-height: 1.6;
          font-weight: 300;
        }

        .btn-primary {
          display: block;
          width: 100%;
          padding: 18px 24px;
          background: var(--accent);
          color: #0e0e0e;
          border: none;
          font-family: var(--sans);
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-top: 40px;
        }

        .btn-primary:hover {
          background: var(--accent-dim);
          transform: translateY(-1px);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .progress-wrap {
          width: 100%;
          margin-bottom: 32px;
        }

        .progress-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--ink-dim);
          margin-bottom: 8px;
          letter-spacing: 0.08em;
        }

        .progress-bar-bg {
          width: 100%;
          height: 2px;
          background: var(--border);
        }

        .progress-bar-fill {
          height: 2px;
          background: var(--accent);
          transition: width 0.4s ease;
        }

        .question-wrap {
          width: 100%;
          animation: fadeUp 0.35s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .question-text {
          font-family: var(--serif);
          font-size: clamp(24px, 6vw, 32px);
          font-weight: 700;
          line-height: 1.4;
          color: var(--ink);
          white-space: pre-line;
          margin-bottom: 40px;
          min-height: 90px;
        }

        .answer-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .answer-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--ink);
          font-family: var(--sans);
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .answer-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .answer-btn .arrow {
          font-size: 12px;
          opacity: 0.4;
          transition: opacity 0.15s;
        }

        .answer-btn:hover .arrow {
          opacity: 1;
        }

        .result-wrap {
          width: 100%;
          animation: fadeUp 0.4s ease both;
        }

        .result-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border: 1px solid var(--accent);
          font-size: 12px;
          letter-spacing: 0.12em;
          color: var(--accent);
          margin-bottom: 20px;
        }

        .result-emoji {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
          line-height: 1;
        }

        .result-title {
          font-family: var(--serif);
          font-size: clamp(28px, 8vw, 40px);
          font-weight: 900;
          line-height: 1.2;
          color: var(--ink);
          margin-bottom: 24px;
        }

        .result-divider {
          width: 40px;
          height: 2px;
          background: var(--accent);
          margin-bottom: 24px;
        }

        .result-section {
          margin-bottom: 20px;
        }

        .result-section-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          color: var(--ink-dim);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .result-section-text {
          font-size: 14px;
          line-height: 1.7;
          color: var(--ink);
          font-weight: 300;
        }

        .result-diagnosis {
          font-family: var(--serif);
          font-size: 17px;
          font-weight: 700;
          color: var(--ink);
          line-height: 1.5;
          margin-bottom: 28px;
          padding-left: 16px;
          border-left: 3px solid var(--accent);
        }

        .share-section {
          margin-top: 36px;
          padding-top: 28px;
          border-top: 1px solid var(--border);
        }

        .share-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          color: var(--ink-dim);
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .btn-share {
          display: block;
          width: 100%;
          padding: 16px 24px;
          background: var(--accent);
          color: var(--bg);
          border: 2px solid var(--accent);
          font-family: var(--sans);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.03em;
        }

        .btn-share:hover {
          background: var(--accent-dim);
          border-color: var(--accent-dim);
          color: var(--bg);
        }

        .btn-share-secondary {
          display: block;
          width: 100%;
          padding: 14px 24px;
          background: transparent;
          color: var(--ink);
          border: 1px solid var(--ink-dim);
          font-family: var(--sans);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.03em;
          margin-top: 10px;
        }

        .btn-share-secondary:hover {
          color: var(--accent);
          border-color: var(--accent);
        }

        .btn-copy {
          display: block;
          width: 100%;
          padding: 14px 24px;
          background: transparent;
          color: var(--ink-dim);
          border: 1px solid var(--border);
          font-family: var(--sans);
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-top: 10px;
        }

        .btn-copy:hover {
          color: var(--ink);
          border-color: var(--ink-dim);
        }

        .btn-copy.done {
          color: var(--accent);
          border-color: var(--accent);
        }

        .restart-link {
          display: block;
          text-align: center;
          font-size: 12px;
          color: var(--ink-dim);
          margin-top: 20px;
          cursor: pointer;
          letter-spacing: 0.05em;
          text-decoration: underline;
          text-underline-offset: 3px;
          background: none;
          border: none;
          font-family: var(--sans);
          width: 100%;
        }

        .restart-link:hover {
          color: var(--ink);
        }

        .soft-cta-section {
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        .soft-cta-title {
          font-family: var(--serif);
          font-size: 16px;
          line-height: 1.6;
          color: var(--ink);
          margin-bottom: 14px;
        }

        .soft-cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .btn-soft-cta {
          display: block;
          width: 100%;
          padding: 15px 18px;
          background: var(--card);
          color: var(--ink);
          border: 1px solid var(--accent);
          font-family: var(--sans);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .btn-soft-cta:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .btn-soft-cta.ghost {
          color: var(--ink-dim);
          border-color: var(--accent);
        }

        .btn-soft-cta.ghost:hover {
          color: var(--accent);
        }

        .deco-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
          margin: 20px 0;
        }
      `}</style>

      <div className="page">
        <div className="content">
          {step === "start" && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              <p className="brand">써, 글놈 진단기</p>
              <h1 className="title-main">
                당신의
                <span className="title-accent">글은</span>
                어디서
                <br />
                멈추는가
              </h1>
              <div className="deco-line" />
              <p className="subtitle">
                왜 자꾸 거기서 멈추는지 확인해보세요.
                <br />
                5개의 질문, 1분이면 됩니다.
              </p>
              <button
                className="btn-primary"
                onClick={() => setStep("question")}
              >
                진단 시작하기 →
              </button>
            </div>
          )}

          {step === "question" && (
            <>
              <div className="progress-wrap">
                <div className="progress-meta">
                  <span>질문</span>
                  <span>
                    {qIndex + 1} / {QUESTIONS.length}
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${((qIndex + 1) / QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div key={animKey} className="question-wrap">
                <p className="question-text">{currentQ.text}</p>
                <div className="answer-list">
                  {ANSWER_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      className="answer-btn"
                      onClick={() => handleAnswer(opt.score)}
                    >
                      {opt.label}
                      <span className="arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === "result" &&
            resultType &&
            (() => {
              const r = RESULTS[resultType];
              return (
                <div className="result-wrap">
                  <div className="result-type-badge">
                    <span>진단 결과</span>
                  </div>

                  <span className="result-emoji">{r.emoji}</span>
                  <h2 className="result-title">{r.label}</h2>

                  <p className="result-diagnosis">{r.diagnosis}</p>

                  <div className="result-divider" />

                  <div className="result-section">
                    <p className="result-section-label">증상</p>
                    <p className="result-section-text">{r.problem}</p>
                  </div>

                  <div className="result-section">
                    <p className="result-section-label">생존 팁</p>
                    <p className="result-section-text">{r.solution}</p>
                  </div>

                  <div className="share-section">
                    <p className="share-label">친구한테 넘기기</p>

                    <button className="btn-share" onClick={handleKakaoShare}>
                      카카오톡으로 공유하기 →
                    </button>

                    <button
                      className="btn-share-secondary"
                      onClick={handleShare}
                    >
                      다른 방법으로 공유하기 →
                    </button>

                    <button
                      className={`btn-copy ${copyDone ? "done" : ""}`}
                      onClick={handleCopyLink}
                    >
                      {copyDone ? "링크 복사됨" : "링크 복사"}
                    </button>
                  </div>

                  <button className="restart-link" onClick={restart}>
                    다시 진단하기
                  </button>

                  <div className="soft-cta-section">
                    <p className="soft-cta-title">
                      진단은 웃겼지만,
                      <br />
                      글은 진짜 끝내고 싶다면
                    </p>

                    <div className="soft-cta-buttons">
                      <button className="btn-soft-cta" onClick={openWorkshop}>
                        500자로 끝까지 써보기 →
                      </button>

                      <button
                        className="btn-soft-cta ghost"
                        onClick={openDiagnosis}
                      >
                        멈춘 원고 방향 보기 →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
      </div>
    </>
  );
}
