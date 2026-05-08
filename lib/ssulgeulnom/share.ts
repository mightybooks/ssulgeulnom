import {
  RESULT_SHARE_IMAGES,
  SITE_URL,
} from "@/constants/urls";
import type { Result, ResultType } from "@/data/ssulgeulnom";

type KakaoLinkPayload = {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: {
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }[];
};

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share?: {
        sendDefault: (payload: KakaoLinkPayload) => void;
      };
    };
  }
}

export type ShareOutcome = "shared" | "copied";

export function buildShareText(result: Result) {
  return `${result.shareMsg}\n\n써, 글놈 진단기 해봐\n왜 네 글도 거기서 멈추는지 확인해라`;
}

export async function copyTextToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export async function shareResult(
  result: Result,
  url: string
): Promise<ShareOutcome> {
  const text = buildShareText(result);

  if (navigator.share) {
    try {
      await navigator.share({ text, url });
      return "shared";
    } catch {
      await copyTextToClipboard(`${text}\n${url}`);
      return "copied";
    }
  }

  await copyTextToClipboard(`${text}\n${url}`);
  return "copied";
}

export async function shareToKakao(
  result: Result,
  resultType: ResultType,
  url: string
): Promise<ShareOutcome> {
  const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

  console.log("[Kakao Share] key exists:", Boolean(kakaoJsKey));
  console.log(
    "[Kakao Share] initialized before:",
    window.Kakao?.isInitialized?.()
  );

  if (!kakaoJsKey || !window.Kakao) {
    return shareResult(result, url);
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(kakaoJsKey);
  }

  console.log("[Kakao Share] initialized after:", window.Kakao.isInitialized());
  console.log(
    "[Kakao Share] sendDefault:",
    window.Kakao.Share?.sendDefault
  );

  if (!window.Kakao.Share?.sendDefault) {
    return shareResult(result, url);
  }

  const imageUrl = `${SITE_URL}${RESULT_SHARE_IMAGES[resultType]}`;

  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: `써, 글놈 진단기 - ${result.label}`,
      description: result.diagnosis,
      imageUrl,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: "진단하러 가기",
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  });

  return "shared";
}
