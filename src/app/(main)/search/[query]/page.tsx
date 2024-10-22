import PublicPaginationPage from "@/components/pagination/PublicPaginationPage";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ query: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    query
  } = params;

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

export default async function MainSearchPage(props: Props) {
  const params = await props.params;

  const {
    query
  } = params;

  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <PublicPaginationPage
      page={1}
      searchString={decodeURIComponent(seachString)}
    />
  );
}
