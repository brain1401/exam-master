import ExamPaginationPage from "@/components/pagination/ExamPaginationPage";
import type { Metadata } from "next";

type Props = {
  params: { query: string };
};

export async function generateMetadata({
  params: { query },
}: Props): Promise<Metadata> {
  return {
    title: `${query} 검색 결과`,
    description: `문제집 ${query} 검색 결과 `,
    openGraph: {
      title: `${query} 검색 결과`,
      description: `문제집 ${query} 검색 결과`,
      type: "website",
    },
  };
}

export default function ExamSearchPage({ params: { query } }: Props) {
  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <ExamPaginationPage
      page={1}
      searchString={decodeURIComponent(seachString)}
    />
  );
}
