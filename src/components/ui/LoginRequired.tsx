"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/C253p3E95V3
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginRequired() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background text-gray-900">
      <div className="mx-auto max-w-md text-center">
        <LockIcon className="mx-auto h-24 w-24 text-blue-500" />
        <h1 className="mt-4 text-2xl text-primary sm:text-3xl font-semibold">로그인 필요</h1>
        <p className="mt-2 text-md sm:text-lg text-gray-500">
          이 페이지에 접근하려면 로그인이 필요합니다.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <Button
            className="border-blue-600 bg-blue-600 text-primary hover:bg-blue-700"
            onClick={() => {
              signIn();
            }}
          >
            로그인 하기
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
