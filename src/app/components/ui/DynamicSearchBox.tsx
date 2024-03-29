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
      <DeleteAndSearchBox
        searchString={searchString}
        setSearchString={setSearchString}
        type={type}
      />
    </>
  );
}
