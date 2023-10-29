import { BsSearch } from "react-icons/bs";

type Props = {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
};
export default function SearchBox({ searchString, setSearchString }: Props) {
  return (
    <div className="mb-4 flex items-center justify-end">
      <div className="flex items-center rounded-full border pl-3 pr-2">
        <input
          type="text"
          className="flex-grow rounded-full py-2 pl-4 focus:border-indigo-500 focus:outline-none"
          name="search"
          id="search"
          placeholder="검색어를 입력하세요."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <button className="p-3">
          <BsSearch className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
