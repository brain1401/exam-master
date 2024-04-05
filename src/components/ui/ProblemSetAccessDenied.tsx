/**
 * v0 by Vercel.
 * @see https://v0.dev/t/GJHImRZSf0Y
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProblemSetAccessDenied() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-white text-gray-900">
      <div className="mx-auto max-w-md text-center">
        <AlertTriangleIcon className="mx-auto h-24 w-24 text-red-500" />
        <h1 className="mt-4 text-3xl font-semibold">접근 거부</h1>
        <p className="mt-2 text-lg text-gray-500">
          이 콘텐츠에 대한 권한이 없습니다.
        </p>
        <div className="mt-6">
          <Button
            className="border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Link href="#">홈으로 가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
