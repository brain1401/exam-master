import PublicPaginationPage from "@/components/pagination/PublicPaginationPage";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ query: string; page: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    query,
    page
  } = params;

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

export default async function MainSearchPage(props: Props) {
  const params = await props.params;

  const {
    page,
    query
  } = params;

  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <PublicPaginationPage
      page={Number(page)}
      searchString={decodeURIComponent(seachString)}
    />
  );
}
