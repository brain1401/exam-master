import ExamPaginationPage from "@/components/pagination/ExamPaginationPage";
import type { Metadata } from "next";

type Props = {
  params: { query: string; page: string };
};

export async function generateMetadata({
  params: { query, page },
}: Props): Promise<Metadata> {
  return {
    title: `${query} 검색 결과 | ${page} 페이지`,
    description: `검색 결과 ${query}의 ${page} 페이지입니다.`,
    openGraph: {
      title: `${query} 검색 결과 | ${page} 페이지`,
      description: `검색 결과 ${query}의 ${page} 페이지입니다.`,
      type: "website",
    },
  };
}

export default function ExamSearchPage({ params: { page, query } }: Props) {
  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <ExamPaginationPage
      page={Number(page)}
      searchString={decodeURIComponent(seachString)}
    />
  );
}
