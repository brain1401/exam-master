import { Input } from "./input";
import { BsSearch } from "react-icons/bs";

type Props = {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
};
export default function SearchBox({ searchString, setSearchString }: Props) {
  return (
    <Input
      type="text"
      name="search"
      id="search"
      placeholder="검색어를 입력하세요."
      value={searchString}
      endContent={<BsSearch />}
      inputClassName="h-[2.3rem] w-[13rem] md:w-[20rem]"
      onChange={(e) => setSearchString(e.target.value)}
    />
  );
}
