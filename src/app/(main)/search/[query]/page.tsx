import PublicPaginationPage from "@/components/publicProblem/PublicPaginationPage";
import JotaiProvider from "@/context/JotaiContext";
import type { Metadata } from "next";

type Props = {
  params: { query: string };
};

export async function generateMetadata({
  params: { query },
}: Props): Promise<Metadata> {
  return {
    title: `${query} 검색 결과`,
    description: `공개 문제집 ${query} 검색 결과 `,
    openGraph: {
      title: `${query} 검색 결과`,
      description: `공개 문제집 ${query} 검색 결과`,
      type: "website",
    },
  };
}

export default function MainSearchPage({ params: { query } }: Props) {
  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <JotaiProvider>
      <PublicPaginationPage
        page={1}
        searchString={decodeURIComponent(seachString)}
      />
    </JotaiProvider>
  );
}
