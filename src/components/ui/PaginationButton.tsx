import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

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
      <Pagination className={className}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          {Array.from({ length: maxPage }, (_, i) => i + 1).map((item) => (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                onClick={() => setPage(item)}
                isActive={item === page}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
