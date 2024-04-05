import ManagePaginationPage from "@/components/pagination/ManagePaginationPage";
import type { Metadata } from "next";

type Props = {
  params: { query: string };
};

export async function generateMetadata({
  params: { query },
}: Props): Promise<Metadata> {
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

export default function ManageSearchPage({ params: { query } }: Props) {
  const seachString = Array.isArray(query) ? query.join(" ") : query;

  return (
    <ManagePaginationPage
      page={1}
      searchString={decodeURIComponent(seachString)}
    />
  );
}
