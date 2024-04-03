import ResultsPaginationPage from "@/components/pagination/results/ResultsPaginationPage";
import JotaiProvider from "@/context/JotaiContext";
import type { Metadata } from "next";

type Props = {
  params: { query: string; page: string };
};

export async function generateMetadata({
  params: { query, page },
}: Props): Promise<Metadata> {
  const searchString = decodeURIComponent(
    Array.isArray(query) ? query.join(" ") : query,
  );
  return {
    title: `${searchString} 검색 결과 | ${page} 페이지`,
    description: `검색 결과 ${searchString}의 ${page} 페이지입니다.`,
    openGraph: {
      title: `${searchString} 검색 결과 | ${page} 페이지`,
      description: `검색 결과 ${searchString}의 ${page} 페이지입니다.`,
      type: "website",
    },
  };
}

export default function ManageSearchPage({ params: { page, query } }: Props) {
  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <JotaiProvider>
      <ResultsPaginationPage
        page={Number(page)}
        searchString={decodeURIComponent(seachString)}
      />
    </JotaiProvider>
  );
}
