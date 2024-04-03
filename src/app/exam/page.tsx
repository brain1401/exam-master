import ExamPaginationPage from "@/components/pagination/ExamPaginationPage";
import JotaiProvider from "@/context/JotaiContext";

export default async function ExamPage() {
  return (
    <JotaiProvider>
      <ExamPaginationPage page={1} />
    </JotaiProvider>
  );
}
