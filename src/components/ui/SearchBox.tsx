import usePagenationState from "@/hooks/usePagenationState";
import { Input } from "./input";
import { BsSearch } from "react-icons/bs";
import useRevalidation from "@/hooks/useRevalidate";
import Link from "next/link";

type Props = {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
  type: "manage" | "exam" | "results";
  className?: string;
};
export default function SearchBox({
  searchString,
  setSearchString,
  type,
}: Props) {
  const { setProblemSetsPage } = usePagenationState();
  const { revalidateAllPathAndRedirect } = useRevalidation();

  const handleSearch = () => {
    if (searchString.length === 0) {
      setProblemSetsPage(1);
      revalidateAllPathAndRedirect(`/${type}`);
    } else {
      revalidateAllPathAndRedirect(
        `/${type}/search/${encodeURIComponent(searchString)}`,
      );
    }
  };

  return (
    <Input
      type="text"
      name="search"
      id="search"
      placeholder="검색어를 입력하세요."
      value={searchString}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      endContent={
        <Link
          href={
            searchString
              ? `/${type}/search/${encodeURIComponent(searchString)}`
              : `/${type}`
          }
        >
          <BsSearch />
        </Link>
      }
      inputClassName="h-[2.3rem] w-[13rem] md:w-[20rem]"
      onChange={(e) => setSearchString(e.target.value)}
    />
  );
}
