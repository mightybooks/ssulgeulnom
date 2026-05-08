import type { Answer, ResultType } from "@/data/ssulgeulnom";

const RESULT_ORDER: ResultType[] = [
  "start_block",
  "burst_early",
  "mid_collapse",
  "end_collapse",
  "no_finish",
];

export function createInitialScores(): Record<ResultType, number> {
  return {
    start_block: 0,
    burst_early: 0,
    mid_collapse: 0,
    end_collapse: 0,
    no_finish: 0,
  };
}

export function calcResult(
  scores: Record<ResultType, number>,
  answers: Answer[]
): ResultType {
  const maxVal = Math.max(...RESULT_ORDER.map((type) => scores[type]));
  const candidates = RESULT_ORDER.filter((type) => scores[type] === maxVal);

  if (candidates.length === 1) {
    return candidates[0];
  }

  const pattern =
    answers.length > 0 ? answers : RESULT_ORDER.map((type) => scores[type]);
  const stableIndex = pattern.reduce((hash, value, index) => {
    return (hash * 31 + (index + 1) * (value + 3)) % 1000003;
  }, candidates.length * 17);

  return candidates[stableIndex % candidates.length];
}
