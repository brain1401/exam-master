import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdQuestionMark } from "react-icons/md";
export default function ProblemSetNotFound() {
  return (
    <section
      key="1"
      className="flex h-full flex-col items-center justify-center bg-white text-gray-900"
    >
      <MdQuestionMark className="h-24 w-24" />
      <h1 className="mt-4 text-3xl font-semibold">
        문제집을 찾을 수 없습니다.
      </h1>
      <p className="mt-2 text-lg text-gray-500">
        요청하신 문제집을 찾을 수 없습니다. 주소를 확인해주세요.
      </p>
      <Button
        className="mt-6 rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        size="lg"
      >
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </section>
  );
}
