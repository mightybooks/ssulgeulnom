import type { Metadata } from "next";
import SsulGeulNomClient from "@/components/ssulgeulnom/SsulGeulNomClient";
import SsulGeulNomJsonLd from "@/components/ssulgeulnom/SsulGeulNomJsonLd";
import { OG_IMAGE_PATH, SITE_URL } from "@/constants/urls";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "써, 글놈 진단기 | 글쓰기 중단 원인 테스트",
  description:
    "글을 쓰다 자꾸 멈추는 사람을 위한 글쓰기 중단 원인 진단 테스트. 5개의 질문으로 첫 문장 앞 석고상형, 초반 도파민 폭주형, 중간 실종형, 결말 앞 퇴사형, 미완성 수집가형 중 내 유형을 확인해보세요.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "써, 글놈 진단기 | 글쓰기 중단 원인 테스트",
    description:
      "왜 당신의 글은 거기서 멈추는가. 글을 쓰다 마는 사람들을 위한 자가폭로형 글쓰기 진단 테스트.",
    url: SITE_URL,
    siteName: "써, 글놈 진단기",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "써, 글놈 진단기 - 글쓰기 중단 원인 테스트",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "써, 글놈 진단기 | 글쓰기 중단 원인 테스트",
    description:
      "글을 쓰다 자꾸 멈추는 사람을 위한 글쓰기 중단 원인 진단 테스트.",
    images: [OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "써글놈",
    "써 글놈",
    "써글놈 진단기",
    "글쓰기 테스트",
    "글쓰기 진단",
    "글쓰기 중단",
    "글쓰기 유형 테스트",
    "미완성 원고",
    "500자 글쓰기",
    "출판 상담",
  ],
};

export default function Page() {
  return (
    <>
      <SsulGeulNomJsonLd />
      <SsulGeulNomClient />
    </>
  );
}
