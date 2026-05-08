import type { ResultType } from "@/data/ssulgeulnom";

export const WORKSHOP_URL =
  "https://xn--hz2b41ezwf0zf9tq.com/workshop/500-character-fiction";

export const DIAGNOSIS_URL =
  "https://xn--hz2b41ezwf0zf9tq.com/support/diagnosis";

export const SITE_TITLE = "써, 글놈 진단기";
export const SITE_DESCRIPTION =
  "글을 쓰다 마는 사람들을 위한 자가폭로형 글쓰기 진단 테스트.";
export const OG_IMAGE_PATH = "/og/ssulgeulnom-og.png";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ssulgeulnom.vercel.app";

export const RESULT_SHARE_IMAGES: Record<ResultType, string> = {
  start_block: "/og/results/start-block.png",
  burst_early: "/og/results/burst-early.png",
  mid_collapse: "/og/results/mid-collapse.png",
  end_collapse: "/og/results/end-collapse.png",
  no_finish: "/og/results/no-finish.png",
};
