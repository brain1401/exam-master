import { MAX_GENERATION_COUNT_PER_WEEK } from "@/const/generationCount";
import Link from "next/link";

export default function LimitReachedPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">생성 제한 도달</h1>
      <p className="mb-8 text-xl">
        죄송합니다. 이번 주의 문제 생성 횟수{" "}
        <b>{MAX_GENERATION_COUNT_PER_WEEK}회</b>를 모두 사용하셨습니다.
      </p>
      <p className="mb-4 text-lg">
        다음 주 월요일 0시 부터 다시 문제를 생성하실 수 있습니다.
      </p>
      <Link
        href="/"
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
