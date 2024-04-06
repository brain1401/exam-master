/**
 * v0 by Vercel.
 * @see https://v0.dev/t/C253p3E95V3
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginRequired() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-white text-gray-900">
      <div className="mx-auto max-w-md text-center">
        <LockIcon className="mx-auto h-24 w-24 text-blue-500" />
        <h1 className="mt-4 text-3xl font-semibold">로그인 필요</h1>
        <p className="mt-2 text-lg text-gray-500">
          이 페이지에 접근하려면 로그인이 필요합니다.
        </p>
        <div className="mt-6">
          <Button className="border-blue-600 bg-blue-600 text-white hover:bg-blue-700">
            <Link href="#">로그인 하기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
