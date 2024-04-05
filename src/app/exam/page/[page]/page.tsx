import ExamPaginationPage from "@/components/pagination/ExamPaginationPage";

type Props = {
  params: {
    page: string;
  };
};

export async function generateMetadata({ params: { page } }: Props) {
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

export default async function ExamPage({ params: { page } }: Props) {
  return <ExamPaginationPage page={Number(page)} />;
}
