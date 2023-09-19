import { BsSearch } from "react-icons/bs";

type Props = {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
}
export default function SearchBox({ searchString, setSearchString }: Props) {
  return (
    <div className="flex justify-end items-center mb-4">
      <div className="flex items-center border rounded-full pl-3 pr-2">
        <input
          type="text"
          className="flex-grow py-2 pl-4 rounded-full focus:outline-none focus:border-indigo-500"
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