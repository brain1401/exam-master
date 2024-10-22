import ExamPaginationPage from "@/components/pagination/ExamPaginationPage";

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
    title: ` 문제집 | ${page} 페이지`,
    description: ` 문제집 목록의 ${page} 페이지입니다.`,
    openGraph: {
      title: ` 문제집 | ${page} 페이지`,
      description: ` 문제집 목록의 ${page} 페이지입니다.`,
      type: "website",
    },
  };
}

export default async function ExamPage(props: Props) {
  const params = await props.params;

  const {
    page
  } = params;

  return <ExamPaginationPage page={Number(page)} />;
}
