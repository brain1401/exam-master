import ManagePaginationPage from "@/components/pagination/ManagePaginationPage";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ query: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    query
  } = params;

  const seachString = decodeURIComponent(
    Array.isArray(query) ? query.join(" ") : query,
  );

  return {
    title: `${seachString} 검색 결과`,
    description: `문제집 ${seachString} 검색 결과 `,
    openGraph: {
      title: `${seachString} 검색 결과`,
      description: `문제집 ${seachString} 검색 결과`,
      type: "website",
    },
  };
}

export default async function ManageSearchPage(props: Props) {
  const params = await props.params;

  const {
    query
  } = params;

  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <ManagePaginationPage
      page={1}
      searchString={decodeURIComponent(seachString)}
    />
  );
}
