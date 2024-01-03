import DeleteAndSearchBox from "./DeleteAndSearchBox";
import SearchBox from "./SearchBox";

type Props = {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
  type: "manage" | "exam" | "result";
};

export default function DynamicSearchBox({
  searchString,
  setSearchString,
  type,
}: Props) {
  return (
    <>
      {type === "manage" ? (
        <DeleteAndSearchBox
          searchString={searchString}
          setSearchString={setSearchString}
        />
      ) : (
        <div className="flex justify-end">
          <SearchBox
            searchString={searchString}
            setSearchString={setSearchString}
          />
        </div>
      )}
    </>
  );
}
