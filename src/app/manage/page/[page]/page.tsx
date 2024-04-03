import ManagePaginationPage from "@/components/pagination/manage/ManagePaginationPage";
import JotaiProvider from "@/context/JotaiContext";

type Props = {
  params: {
    page: string;
  };
};

export async function generateMetadata({ params: { page } }: Props) {
  return {
    title: `문제집 관리 | ${page} 페이지`,
    description: `문제집 관리 목록의 ${page} 페이지입니다.`,
    openGraph: {
      title: `문제집 관리 | ${page} 페이지`,
      description: `문제집 관리 목록의 ${page} 페이지입니다.`,
      type: "website",
    },
  };
}

export default async function ManagePage({ params: { page } }: Props) {
  return (
    <JotaiProvider>
      <ManagePaginationPage page={Number(page)} />
    </JotaiProvider>
  );
}
