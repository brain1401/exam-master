import DeleteAndSearchBox from "./DeleteAndSearchBox";

type Props = {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
  type: "manage" | "exam" | "results";
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
