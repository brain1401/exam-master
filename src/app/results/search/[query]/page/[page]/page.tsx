import ResultsPaginationPage from "@/components/pagination/ResultsPaginationPage";
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

export default async function ManageSearchPage(props: Props) {
  const params = await props.params;

  const {
    page,
    query
  } = params;

  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <ResultsPaginationPage
      page={Number(page)}
      searchString={decodeURIComponent(seachString)}
    />
  );
}
