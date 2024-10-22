import ExamPaginationPage from "@/components/pagination/ExamPaginationPage";
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
    description: `문제집 ${query} 검색 결과 `,
    openGraph: {
      title: `${query} 검색 결과`,
      description: `문제집 ${query} 검색 결과`,
      type: "website",
    },
  };
}

export default async function ExamSearchPage(props: Props) {
  const params = await props.params;

  const {
    query
  } = params;

  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <ExamPaginationPage
      page={1}
      searchString={decodeURIComponent(seachString)}
    />
  );
}
