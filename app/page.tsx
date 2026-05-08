import type { Metadata } from "next";
import SsulGeulNomClient from "@/components/ssulgeulnom/SsulGeulNomClient";
import { OG_IMAGE_PATH, SITE_URL } from "@/constants/urls";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "써, 글놈 진단기 | 왜 당신의 글은 거기서 멈추는가",
  description:
    "글을 쓰다 마는 사람들을 위한 자가폭로형 글쓰기 진단 테스트. 5개의 질문으로 당신의 글쓰기 사망 지점을 찾아드립니다.",
  openGraph: {
    title: "써, 글놈 진단기",
    description: "왜 당신의 글은 거기서 멈추는가",
    images: [OG_IMAGE_PATH],
  },
};

export default function Page() {
  return <SsulGeulNomClient />;
}
