import ResultsPaginationPage from "@/components/pagination/ResultsPaginationPage";
import type { Metadata } from "next";

type Props = {
  params: { query: string };
};

export async function generateMetadata({
  params: { query },
}: Props): Promise<Metadata> {
  const searchString = decodeURIComponent(
    Array.isArray(query) ? query.join(" ") : query,
  );

  return {
    title: `${searchString} 검색 결과`,
    description: `문제집 ${searchString} 검색 결과 `,
    openGraph: {
      title: `${searchString} 검색 결과`,
      description: `문제집 ${searchString} 검색 결과`,
      type: "website",
    },
  };
}

export default function ResultsSearchPage({ params: { query } }: Props) {
  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <ResultsPaginationPage
      page={1}
      searchString={decodeURIComponent(seachString)}
    />
  );
}
