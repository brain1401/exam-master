import ExamPaginationPage from "@/components/pagination/ExamPaginationPage";
import JotaiProvider from "@/context/JotaiContext";

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
  return (
    <JotaiProvider>
      <ExamPaginationPage page={Number(page)} />
    </JotaiProvider>
  );
}
