import ResultsPaginationPage from "@/components/pagination/ResultsPaginationPage";
import JotaiProvider from "@/context/JotaiContext";

export default async function Results() {
  return (
    <JotaiProvider>
      <ResultsPaginationPage page={1} />
    </JotaiProvider>
  );
}
