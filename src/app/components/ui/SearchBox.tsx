import { Input } from "@nextui-org/react";
import { BsSearch } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

type Props = {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
};
export default function SearchBox({ searchString, setSearchString, className }: Props) {
  return (
    <div className={twMerge("mb-4 flex items-center justify-end",className)}>
      <Input
        type="text"
        name="search"
        variant="bordered"
        classNames={{
          base: "w-fit",
          inputWrapper: "w-[13rem] md:w-[20rem] h-[2.3rem]",
          input: "pr-2 pl-3 text-sm",
          innerWrapper: "pr-2"
        }}
        id="search"
        radius="full"
        size="sm"
        placeholder="검색어를 입력하세요."
        value={searchString}
        endContent={<BsSearch/>}
        onChange={(e) => setSearchString(e.target.value)}
      />
    </div>
  );
}
