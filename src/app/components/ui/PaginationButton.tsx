"use client";
import useCustomMediaQuery from "@/hooks/useCustomMediaQuery";
import { Pagination } from "@nextui-org/react";

type Props = {
  setPage: (page: number) => void;
  maxPage: number;
  page: number;
  className?: string;
};

export default function PaginationButton({
  setPage,
  maxPage,
  page,
  className,
}: Props) {
  
  return (
    <>
      <Pagination
        className={className}
        classNames={{
          item: "bg-nextUiBorder",
          next: "bg-nextUiBorder !text-black",
          prev: "bg-nextUiBorder !text-black",
        }}
        total={maxPage}
        page={page}
        onChange={setPage}
        showControls
        size="sm"
      />
    </>
  );
}
