import Link from "next/link";

type Props = {
  statusCode?: number;
  title?: string;
};
export default function CustomError({ statusCode, title }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900">
      <header className="flex items-center justify-center bg-white px-6 py-4">
        <Link className="flex items-center space-x-2" href="/">
          <SchoolIcon className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-semibold text-gray-900">
            Exam Master
          </span>
        </Link>
      </header>
      <main className="flex flex-col items-center justify-center bg-white px-6 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-6xl font-bold text-gray-900">{statusCode ?? "404"}</h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            {title || "Oops! The page you're looking for doesn't exist."}
          </p>
          <div className="mt-8">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="/"
            >
              Go Home
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
