import Link from "next/link";
import { Input } from "../ui/input";
import { IoSearchOutline } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useRevalidation from "@/hooks/useRevalidate";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import usePublicProblem from "@/hooks/usePublicProblem";
import { SortType } from "@/types/problems";

export default function MainPageSearchBar() {
  const { revalidateAllPathAndRedirect, revalidateAllPath } = useRevalidation();
  const { searchString, sort, setSort } = usePublicProblem();

  const [localSearchString, setLocalSearchString] = useState(
    searchString ?? "",
  );

  useEffect(() => {
    setLocalSearchString(searchString ?? "");
  }, [searchString]);

  // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화
  useEffect(() => {
    revalidateAllPath();
    console.log("revalidateAllPath");
  }, [revalidateAllPath]);

  const handleSearch = () => {
    if (localSearchString.length === 0) {
      revalidateAllPathAndRedirect("/");
    } else {
      revalidateAllPathAndRedirect(
        `/search/${encodeURIComponent(localSearchString)}`,
      );
    }
  };

  return (
    <>
      <Input
        inputClassName="flex-1"
        wrapperClassName="mr-4 flex-1"
        placeholder="문제 세트 검색"
        endContent={
          <Link
            href={
              localSearchString
                ? `/search/${encodeURIComponent(localSearchString)}`
                : "/"
            }
          >
            <IoSearchOutline className="h-5 w-5 cursor-pointer" />
          </Link>
        }
        value={localSearchString}
        onChange={(e) => setLocalSearchString(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Select
        defaultValue={sort}
        value={sort}
        onValueChange={(value) => {
          setSort(value as SortType);
        }}
      >
        <SelectTrigger className="w-[6rem] md:w-[8rem]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-20">
          <SelectItem value="popular">인기순</SelectItem>
          <SelectItem value="newest">최신순</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
