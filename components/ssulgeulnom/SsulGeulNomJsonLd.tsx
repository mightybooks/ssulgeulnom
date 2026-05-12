import { OG_IMAGE_PATH, SITE_URL } from "@/constants/urls";

export default function SsulGeulNomJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "써, 글놈 진단기",
    alternateName: [
      "써글놈",
      "써 글놈",
      "글쓰기 중단 원인 테스트",
      "글쓰기 유형 테스트",
    ],
    url: SITE_URL,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web",
    inLanguage: "ko-KR",
    description:
      "글을 쓰다 자꾸 멈추는 사람을 위한 글쓰기 중단 원인 진단 테스트. 5개의 질문으로 사용자의 글쓰기 중단 유형을 보여줍니다.",
    image: `${SITE_URL}${OG_IMAGE_PATH}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    creator: {
      "@type": "Organization",
      name: "마이티북스",
      url: "https://xn--hz2b41ezwf0zf9tq.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
