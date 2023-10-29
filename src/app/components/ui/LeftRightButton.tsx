import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  maxPage: number;
};
export default function LeftRightButton({ page, setPage, maxPage }: Props) {
  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      <button
        className="px-3 py-5"
        onClick={() => {
          if (page > 1) setPage(page - 1);
        }}
      >
        <IoMdArrowDropleftCircle className="h-10 w-10" />
      </button>

      <span className="text-gray-500">
        {page} / {maxPage}
      </span>
      <button
        className="px-3 py-5"
        onClick={() => {
          if (page < maxPage) setPage(page + 1);
        }}
      >
        <IoMdArrowDroprightCircle className="h-10 w-10" />
      </button>
    </div>
  );
}
