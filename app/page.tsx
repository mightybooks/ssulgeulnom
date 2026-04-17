"use client";

import { useState } from "react";

// ─── 타입 ───────────────────────────────────────────────
type Answer = 2 | 1 | 0; // 그렇다 | 보통이다 | 아니다
type Step = "start" | "question" | "result";

type ResultType =
  | "start_block"
  | "burst_early"
  | "mid_collapse"
  | "end_collapse"
  | "no_finish";

// ─── 질문 데이터 ────────────────────────────────────────
const QUESTIONS: { id: number; text: string; resultType: ResultType }[] = [
  { id: 1, text: "글을 시작하기까지\n시간이 오래 걸린다", resultType: "start_block" },
  { id: 2, text: "시작하면 초반은\n잘 써진다", resultType: "burst_early" },
  { id: 3, text: "중간부터\n갑자기 막힌다", resultType: "mid_collapse" },
  { id: 4, text: "거의 다 왔는데\n흐름이 무너진다", resultType: "end_collapse" },
  { id: 5, text: "끝까지 써본 적이\n거의 없다", resultType: "no_finish" },
];

// ─── 결과 데이터 ────────────────────────────────────────
const RESULTS: Record<
  ResultType,
  {
    label: string;
    emoji: string;
    diagnosis: string;
    problem: string;
    solution: string;
    shareMsg: string;
  }
> = {
  start_block: {
    label: "시작 불능형",
    emoji: "🧱",
    diagnosis: "당신은 첫 문장 앞에서 얼어붙습니다.",
    problem:
      "완벽한 시작을 기다리다 아무것도 시작하지 않는 패턴입니다. 글의 1번째 줄이 아니라 '시작한다'는 결정 자체가 막혀 있습니다.",
    solution:
      "시작 의식이 아니라 시작 구조가 필요합니다. 칸이 있으면 채웁니다. 8칸으로 나뉜 구조가 첫 문장의 압박을 없애줍니다.",
    shareMsg:
      "나 시작 불능형 나왔는데\n너는 어디서 멈추냐 🧱",
  },
  burst_early: {
    label: "초반 폭주형",
    emoji: "💥",
    diagnosis: "당신은 시작만 화려하고 금방 꺼집니다.",
    problem:
      "에너지가 앞에 몰려 있습니다. 흥분해서 쏟아내지만 방향 없이 달리다 지쳐버립니다. 초반의 기세가 전부인 글쓰기입니다.",
    solution:
      "폭주를 막는 건 의지가 아니라 구조입니다. 8개의 칸이 에너지를 고르게 분배합니다. 처음부터 끝까지 같은 속도로.",
    shareMsg:
      "나 초반 폭주형 나왔는데\n너는 어디서 멈추냐 💥",
  },
  mid_collapse: {
    label: "전개 붕괴형",
    emoji: "🌀",
    diagnosis: "당신은 중간에서 항상 길을 잃습니다.",
    problem:
      "시작은 있는데 이야기를 어디로 끌고 가야 할지 모릅니다. 전개 구조가 없으면 중간은 항상 빈 공간이 됩니다.",
    solution:
      "전개는 창의력이 아니라 순서의 문제입니다. 8칸의 흐름이 중간이 어디로 가야 하는지 알려줍니다.",
    shareMsg:
      "나 또 전개 붕괴형 나왔는데\n너는 어디서 멈추냐 🌀",
  },
  end_collapse: {
    label: "후반 붕괴형",
    emoji: "📉",
    diagnosis: "당신은 끝 직전에 항상 무너집니다.",
    problem:
      "90%까지 왔다가 마지막 10%에서 힘이 빠집니다. 결말을 어떻게 맺어야 할지 몰라서 흐지부지 끝납니다. 아쉽게 마무리된 글들이 쌓여 있습니다.",
    solution:
      "결말은 새로 만드는 게 아니라 8번째 칸에 이미 정해져 있습니다. 구조가 있으면 후반도 무너지지 않습니다.",
    shareMsg:
      "나 후반 붕괴형 나왔는데\n너는 어디서 멈추냐 📉",
  },
  no_finish: {
    label: "완결 실패형",
    emoji: "🚫",
    diagnosis: "당신은 끝을 본 적이 없습니다.",
    problem:
      "완성된 글이 없습니다. 초고, 메모, 반쪽짜리 글들만 쌓여 있습니다. 마감 없는 글쓰기는 완성 없는 글쓰기입니다.",
    solution:
      "완결을 만드는 건 근성이 아니라 틀입니다. 8칸을 채우면 한 편이 완성됩니다. 구조가 끝을 만들어줍니다.",
    shareMsg:
      "나 완결 실패형 나왔는데\n너는 어디서 멈추냐 🚫",
  },
};

// ─── 유틸 ────────────────────────────────────────────────
function calcResult(scores: Record<ResultType, number>): ResultType {
  let max: ResultType = "start_block";
  let maxVal = -1;
  for (const [key, val] of Object.entries(scores)) {
    if (val > maxVal) {
      maxVal = val;
      max = key as ResultType;
    }
  }
  return max;
}

// ─── 메인 컴포넌트 ───────────────────────────────────────
export default function SsulGeulNomPage() {
  const [step, setStep] = useState<Step>("start");
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState<Record<ResultType, number>>({
    start_block: 0,
    burst_early: 0,
    mid_collapse: 0,
    end_collapse: 0,
    no_finish: 0,
  });
  const [resultType, setResultType] = useState<ResultType | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const currentQ = QUESTIONS[qIndex];

  // 답변 처리
  function handleAnswer(score: Answer) {
    const newScores = {
      ...scores,
      [currentQ.resultType]: scores[currentQ.resultType] + score,
    };
    setScores(newScores);

    if (qIndex < QUESTIONS.length - 1) {
      setAnimKey((k) => k + 1);
      setQIndex(qIndex + 1);
    } else {
      const result = calcResult(newScores);
      setResultType(result);
      setStep("result");
    }
  }

  // 공유
  async function handleShare() {
    if (!resultType) return;
    const result = RESULTS[resultType];
    const text = `${result.shareMsg}\n\n써, 글놈 진단기 해봐`;
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({ text, url });
      } catch (_) {
        fallbackCopy(text + "\n" + url);
      }
    } else {
      fallbackCopy(text + "\n" + url);
    }
  }

  function fallbackCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    });
  }

  function handleCTA() {
    window.open("https://smartstore.naver.com/shop15th/products/8091029469", "_blank");
  }

  function restart() {
    setStep("start");
    setQIndex(0);
    setScores({
      start_block: 0,
      burst_early: 0,
      mid_collapse: 0,
      end_collapse: 0,
      no_finish: 0,
    });
    setResultType(null);
    setCopyDone(false);
  }

  // ─── 렌더 ───────────────────────────────────────────────
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
          --danger: #e85a4a;
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

        /* ── 노이즈 텍스처 오버레이 ── */
        .page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .content { position: relative; z-index: 1; width: 100%; }

        /* ── 타이틀 ── */
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
          letter-spacing: -0.02em;
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

        /* ── 버튼 ── */
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

        .btn-ghost {
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
          margin-top: 12px;
        }

        .btn-ghost:hover {
          color: var(--ink);
          border-color: var(--ink-dim);
        }

        /* ── 진행률 ── */
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

        /* ── 질문 ── */
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

        /* ── 답변 버튼 ── */
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

        /* ── 결과 ── */
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

        /* ── 공유 ── */
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
          background: transparent;
          color: var(--ink);
          border: 2px solid var(--ink);
          font-family: var(--sans);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.03em;
        }

        .btn-share:hover {
          background: var(--ink);
          color: var(--bg);
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

        /* ── CTA ── */
        .cta-section {
          margin-top: 28px;
          padding: 24px;
          background: #1e1a0e;
          border: 1px solid var(--accent-dim);
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent);
        }

        .cta-warning {
          font-size: 13px;
          color: var(--accent);
          font-weight: 500;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .btn-cta {
          display: block;
          width: 100%;
          padding: 18px 24px;
          background: var(--accent);
          color: #0e0e0e;
          border: none;
          font-family: var(--sans);
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-cta:hover {
          background: var(--accent-dim);
          transform: translateY(-1px);
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

        /* ── 데코 라인 ── */
        .deco-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
          margin: 20px 0;
        }
      `}</style>

      <div className="page">
        <div className="content">

          {/* ── START ─────────────────────────────────── */}
          {step === "start" && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              <p className="brand">써, 글놈 진단기</p>
              <h1 className="title-main">
                왜 당신의
                <span className="title-accent">글은</span>
                거기서<br />멈추는가
              </h1>
              <div className="deco-line" />
              <p className="subtitle">
                어디서 항상 멈추는지 확인해보세요.<br />
                5개의 질문, 1분이면 됩니다.
              </p>
              <button
                className="btn-primary"
                onClick={() => setStep("question")}
              >
                시작하기 →
              </button>
            </div>
          )}

          {/* ── QUESTION ──────────────────────────────── */}
          {step === "question" && (
            <>
              {/* 진행률 */}
              <div className="progress-wrap">
                <div className="progress-meta">
                  <span>질문</span>
                  <span>{qIndex + 1} / {QUESTIONS.length}</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${((qIndex + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* 질문 */}
              <div key={animKey} className="question-wrap">
                <p className="question-text">{currentQ.text}</p>
                <div className="answer-list">
                  {[
                    { label: "그렇다", score: 2 as Answer },
                    { label: "보통이다", score: 1 as Answer },
                    { label: "아니다", score: 0 as Answer },
                  ].map((opt) => (
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

          {/* ── RESULT ────────────────────────────────── */}
          {step === "result" && resultType && (() => {
            const r = RESULTS[resultType];
            return (
              <div className="result-wrap">
                {/* 뱃지 */}
                <div className="result-type-badge">
                  <span>진단 결과</span>
                </div>

                {/* 이모지 + 타입 */}
                <span className="result-emoji">{r.emoji}</span>
                <h2 className="result-title">{r.label}</h2>

                {/* 진단 문장 */}
                <p className="result-diagnosis">{r.diagnosis}</p>

                <div className="result-divider" />

                {/* 문제 설명 */}
                <div className="result-section">
                  <p className="result-section-label">문제</p>
                  <p className="result-section-text">{r.problem}</p>
                </div>

                {/* 해결 방향 */}
                <div className="result-section">
                  <p className="result-section-label">해결 방향</p>
                  <p className="result-section-text">{r.solution}</p>
                </div>

                {/* ── 공유 ── */}
                <div className="share-section">
                  <p className="share-label">친구한테 떠넘기기</p>

                  {/* 공유 버튼 */}
                  <button className="btn-share" onClick={handleShare}>
                    친구한테 떠넘기기 ↗
                  </button>

                  {/* 링크 복사 버튼 */}
                  <button
                    className={`btn-copy ${copyDone ? "done" : ""}`}
                    onClick={() => fallbackCopy(window.location.href)}
                  >
                    {copyDone ? "✓ 링크 복사됨" : "링크 복사"}
                  </button>
                </div>

                {/* ── CTA ── */}
                <div className="cta-section">
                  <p className="cta-warning">
                    이 상태로는 계속 여기서 멈춥니다.
                    <br />
                    구조 없이 쓰고 있기 때문입니다.
                  </p>
                  <button className="btn-cta" onClick={handleCTA}>
                    8단계로 나눠서 바로 써보기 →
                  </button>
                </div>

                {/* 재시작 */}
                <button className="restart-link" onClick={restart}>
                  다시 진단하기
                </button>
              </div>
            );
          })()}

        </div>
      </div>
    </>
  );
}
