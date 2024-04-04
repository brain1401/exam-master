import PublicPaginationPage from "@/components/pagination/PublicPaginationPage";

type Props = {
  params: {
    page: string;
  };
};

export async function generateMetadata({ params: { page } }: Props) {
  return {
    title: `공개 문제집 | ${page} 페이지`,
    description: `공개 문제집 목록의 ${page} 페이지입니다.`,
    openGraph: {
      title: `공개 문제집 | ${page} 페이지`,
      description: `공개 문제집 목록의 ${page} 페이지입니다.`,
      type: "website",
    },
  };
}

export default async function PublicPage({ params: { page } }: Props) {
  return <PublicPaginationPage page={Number(page)} />;
}
