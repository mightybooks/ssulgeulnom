export type Answer = 2 | 1 | 0;

export type Step = "start" | "question" | "result";

export type ResultType =
  | "start_block"
  | "burst_early"
  | "mid_collapse"
  | "end_collapse"
  | "no_finish";

export type Question = {
  id: number;
  text: string;
  resultType: ResultType;
};

export type Result = {
  label: string;
  emoji: string;
  diagnosis: string;
  problem: string;
  solution: string;
  shareMsg: string;
};

export const ANSWER_OPTIONS: { label: string; score: Answer }[] = [
  { label: "그렇다", score: 2 },
  { label: "보통이다", score: 1 },
  { label: "아니다", score: 0 },
];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "글을 쓰려고 앉으면\n첫 문장 앞에서\n일단 뇌가 정지한다",
    resultType: "start_block",
  },
  {
    id: 2,
    text: "처음엔 잘 나간다\n그런데 고장난 중고차처럼\n잘 가다말고 멈춘다",
    resultType: "burst_early",
  },
  {
    id: 3,
    text: "분명 자료와 메모는 많은데\n본문은 자꾸 실종된다",
    resultType: "mid_collapse",
  },
  {
    id: 4,
    text: "거의 다 썼는데\n마지막 문단 앞에서 글이 퇴사한다",
    resultType: "end_collapse",
  },
  {
    id: 5,
    text: "내 폴더에는 시작한 글이 많고\n완성된 글은 낯을 가린다",
    resultType: "no_finish",
  },
];

export const RESULTS: Record<ResultType, Result> = {
  start_block: {
    label: "첫 문장 앞 석고상형",
    emoji: "🗿",
    diagnosis: "당신은 글을 쓰기 전에 이미 굳어버립니다.",
    problem:
      "제목을 정하고, 폰트를 바꾸고, 커피를 내리고, 책상을 정리하고, 갑자기 인생도 정리하려 듭니다. 정작 첫 문장은 아직 출근하지 않았습니다.",
    solution:
      "첫 문장은 작품의 운명이 아닙니다. 그냥 문을 여는 손잡이입니다. 손잡이에 금박 입히다 집에 못 들어갑니다.",
    shareMsg:
      "나 첫 문장 앞 석고상형 나옴.\n너도 글 쓰다 굳는 타입인지 봐라 🗿",
  },
  burst_early: {
    label: "초반 도파민 폭주형",
    emoji: "💥",
    diagnosis: "당신은 시작할 때만 거의 천재입니다.",
    problem:
      "초반 문장은 불타오릅니다. 문제는 그 천재가 7분 정도만 근무한다는 점입니다. 어느 순간 천재는 조기 퇴근을 해버리고 쓴다만 원고만 남아 있죠.",
    solution:
      "처음부터 다 쏟지 마십시오. 글은 단거리 달리기가 아니라, 중간에 본인이 질려도 끌고 가야 하는 이상한 운송업입니다.",
    shareMsg:
      "나 초반 도파민 폭주형 나옴.\n시작은 잘하는데 끝은 모르는 인간 인증 💥",
  },
  mid_collapse: {
    label: "중간 실종형",
    emoji: "🌀",
    diagnosis: "당신의 글은 중간에서 자주 실종됩니다.",
    problem:
      "시작은 했습니다. 방향도 있는 줄 알았습니다. 그런데 중간쯤 오면 모든 문장이 서로 초면처럼 굴기 시작합니다. 작가님은 현장에 계셨지만, 전개는 실종됐습니다.",
    solution:
      "중간은 영감으로 버티는 구간이 아닙니다. 대충 쓰면 대충 길을 잃습니다. 무섭게도 글은 정직합니다.",
    shareMsg:
      "나 중간 실종형 나옴.\n내 글 전개 본 사람 있으면 제보 바랍니다 🌀",
  },
  end_collapse: {
    label: "결말 앞 퇴사형",
    emoji: "📉",
    diagnosis: "당신의 글은 마지막 문단 앞에서 사직서를 냅니다.",
    problem:
      "거의 다 왔습니다. 조금만 더 쓰면 됩니다. 그런데 그 조금이 히말라야입니다. 마지막 10%가 늘 반란을 일으킵니다.",
    solution:
      "결말은 대단한 폭죽이 아니어도 됩니다. 문만 닫아도 결말입니다. 문제는 자꾸 문짝을 새로 만들려 한다는 겁니다.",
    shareMsg:
      "나 결말 앞 퇴사형 나옴.\n내 글은 늘 마지막에 사직서 냄 📉",
  },
  no_finish: {
    label: "미완성 수집가형",
    emoji: "🪦",
    diagnosis: "당신의 폴더에는 가능성이 너무 많습니다.",
    problem:
      "메모도 있고, 초안도 있고, 언젠가 쓸 문장도 있습니다. 문제는 그 ‘언젠가’가 매년 재계약 중이라는 점입니다. 폴더를 열면 미완성의 무덤들만 반기고 있죠.",
    solution:
      "모든 글을 작품으로 만들 필요는 없습니다. 다만 하나쯤은 끝내야 합니다. 그래야 폴더가 공동묘지가 아니라 작업실이 됩니다.",
    shareMsg:
      "나 미완성 수집가형 나옴.\n내 폴더 자체가 쓰다 접은 원고 공동묘지임 🪦",
  },
};
