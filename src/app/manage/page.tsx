import ManagePaginationPage from "@/components/pagination/ManagePaginationPage";
import JotaiProvider from "@/context/JotaiContext";

export default async function ManagePage() {
  return (
    <JotaiProvider>
      <ManagePaginationPage page={1} />
    </JotaiProvider>
  );
}
