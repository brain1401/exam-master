import PublicPaginationPage from "@/components/pagination/PublicPaginationPage";

type Props = {
  params: Promise<{
    page: string;
  }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    page
  } = params;

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

export default async function PublicPage(props: Props) {
  const params = await props.params;

  const {
    page
  } = params;

  return <PublicPaginationPage page={Number(page)} />;
}
