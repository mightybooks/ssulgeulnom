import type { Answer, ResultType } from "@/data/ssulgeulnom";

const RESULT_ORDER: ResultType[] = [
  "start_block",
  "burst_early",
  "mid_collapse",
  "end_collapse",
  "no_finish",
];

const TIE_BREAK_PRIORITY: ResultType[] = [
  "no_finish",
  "mid_collapse",
  "end_collapse",
  "burst_early",
  "start_block",
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
  _answers: Answer[]
): ResultType {
  const values = RESULT_ORDER.map((type) => scores[type]);
  const maxVal = Math.max(...values);
  const candidates = RESULT_ORDER.filter((type) => scores[type] === maxVal);

  if (candidates.length === 1) {
    return candidates[0];
  }

  const allScoresEqual = values.every((value) => value === values[0]);

  if (allScoresEqual) {
    return "no_finish";
  }

  return TIE_BREAK_PRIORITY.find((type) => candidates.includes(type))!;
}
