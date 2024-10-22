import ManagePaginationPage from "@/components/pagination/ManagePaginationPage";

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
    title: `문제집 관리 | ${page} 페이지`,
    description: `문제집 관리 목록의 ${page} 페이지입니다.`,
    openGraph: {
      title: `문제집 관리 | ${page} 페이지`,
      description: `문제집 관리 목록의 ${page} 페이지입니다.`,
      type: "website",
    },
  };
}

export default async function ManagePage(props: Props) {
  const params = await props.params;

  const {
    page
  } = params;

  return <ManagePaginationPage page={Number(page)} />;
}
