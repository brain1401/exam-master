import ResultsPaginationPage from "@/components/pagination/ResultsPaginationPage";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ query: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    query
  } = params;

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

export default async function ResultsSearchPage(props: Props) {
  const params = await props.params;

  const {
    query
  } = params;

  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <ResultsPaginationPage
      page={1}
      searchString={decodeURIComponent(seachString)}
    />
  );
}
