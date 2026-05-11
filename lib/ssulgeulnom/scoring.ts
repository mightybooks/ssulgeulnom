import type { Answer, ResultType } from "@/data/ssulgeulnom";

const RESULT_ORDER: ResultType[] = [
  "start_block",
  "burst_early",
  "mid_collapse",
  "end_collapse",
  "no_finish",
];

const TIE_BREAK_PRIORITY: ResultType[] = [
  "mid_collapse",
  "end_collapse",
  "burst_early",
  "start_block",
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
  const entries = Object.entries(scores) as [ResultType, number][];
  const values = entries.map(([, value]) => value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  if (maxValue === minValue) {
    const totalAnswerValue = answers.reduce<number>(
      (sum, value) => sum + value,
      0
    );

    if (totalAnswerValue >= 8) {
      return "no_finish";
    }

    if (totalAnswerValue <= 2) {
      return "mid_collapse";
    }

    return "end_collapse";
  }

  const candidates = entries
    .filter(([, value]) => value === maxValue)
    .map(([type]) => type);

  if (candidates.length === 1) {
    return candidates[0];
  }

  const nonNoFinishCandidates = candidates.filter(
    (type) => type !== "no_finish"
  );

  const tieCandidates =
    nonNoFinishCandidates.length > 0 ? nonNoFinishCandidates : candidates;

  const fallback = TIE_BREAK_PRIORITY.find((type) =>
    tieCandidates.includes(type)
  );

  return fallback ?? tieCandidates[0];
}
