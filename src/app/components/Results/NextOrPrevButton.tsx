import { Button } from "@nextui-org/react";

type Props = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  maxPage: number;
};

export default function NextOrPrevButton({ setPage, maxPage }: Props) {
  return (
    <div className="mt-5 flex justify-center gap-5">
      <Button
        onClick={() => {
          setPage((prev) => (prev > 1 ? prev - 1 : prev));
        }}
      >
        이전
      </Button>
      <Button
        onClick={() => {
          setPage((prev) => (prev < maxPage ? prev + 1 : prev));
        }}
      >
        다음
      </Button>
    </div>
  );
}
