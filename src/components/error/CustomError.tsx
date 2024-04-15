"use client";
import { useEffect } from "react";

import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  statusCode?: number;
  title?: string;
};
export default function CustomError({ statusCode, title }: Props) {
  useEffect(() => {
    throw new Error(title ?? "An unexpected error occurred.");
  }, [title]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background text-gray-900">
      <header className="flex items-center justify-center bg-background px-6 py-4">
        <Link className="flex items-center space-x-2" href="/">
          <SchoolIcon className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-semibold text-gray-900 text-primary">
            Exam Master
          </span>
        </Link>
      </header>
      <main className="flex flex-col items-center justify-center bg-background px-6 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-6xl font-bold text-zinc-300">
            {statusCode ?? "404"}
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            {title || "이런! 페이지를 찾을 수 없습니다."}
          </p>
          <div className="mt-8">
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function SchoolIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m4 6 8-4 8 4" />
      <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
      <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" />
      <path d="M18 5v17" />
      <path d="M6 5v17" />
      <circle cx="12" cy="9" r="2" />
    </svg>
  );
}
