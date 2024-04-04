import usePublicProblem from "@/hooks/usePublicProblem";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import usePagenationState from "@/hooks/usePagenationState";

type TypeType = "manage" | "public" | "results" | "exam";

export function getBasePaginationLink(type: TypeType, searchString?: string) {
  switch (type) {
    case "manage":
      if (searchString) {
        return `/manage/search/${encodeURIComponent(searchString)}`;
      }
      return "/manage";
    case "results":
      if (searchString) {
        return `/results/search/${encodeURIComponent(searchString)}`;
      }
      return "/results";
    case "exam":
      if (searchString) {
        return `/exam/search/${encodeURIComponent(searchString)}`;
      }
      return "/exam";
    case "public":
      if (searchString) {
        return `/search/${encodeURIComponent(searchString)}/page/1`;
      }
      return "/";
  }
}

export function getPaginationLink(
  type: TypeType,
  page: number,
  searchString?: string,
) {
  switch (type) {
    case "manage":
      if (searchString) {
        return `${getBasePaginationLink(type, searchString)}/page/${page}`;
      }
      return `${getBasePaginationLink(type, searchString)}/page/${page}`;
    case "results":
      if (searchString) {
        return `${getBasePaginationLink(type, searchString)}/page/${page}`;
      }
      return `${getBasePaginationLink(type, searchString)}/page/${page}`;
    case "exam":
      if (searchString) {
        return `${getBasePaginationLink(type, searchString)}/page/${page}`;
      }
      return `${getBasePaginationLink(type, searchString)}/page/${page}`;
    case "public":
      if (searchString) {
        return `/search/${encodeURIComponent(searchString)}/page/${page}`;
      }
      return `/page/${page}`;
  }
}

type Props = {
  page: number;
  type: TypeType;
  maxPage: number;
  searchString: string;
  className?: string;
};

export default function PaginationButton({
  className,
  type,
  maxPage,
  page,
  searchString,
}: Props) {
  const { publicProblemSetsMaxPage, publicProblemSetsPage } =
    usePagenationState();

  const getVisiblePages = () => {
    if (maxPage <= 5) {
      return Array.from({ length: maxPage }, (_, i) => i + 1);
    }

    const visiblePages = [];
    let start = page - 2;
    let end = page + 2;

    if (start < 1) {
      end += 1 - start;
      start = 1;
    }

    if (end > maxPage) {
      start -= end - maxPage;
      end = maxPage;
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  return (
    <>
      <Pagination className={className}>
        <PaginationContent>
          {maxPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={
                  page - 1 === 1
                    ? getBasePaginationLink(type, searchString)
                    : `${getPaginationLink(type, page - 1 > 0 ? page - 1 : page, searchString)}`
                }
              />
            </PaginationItem>
          )}
          {maxPage > 5 && page > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {getVisiblePages().map((item) => (
            <PaginationItem key={item}>
              <PaginationLink
                href={
                  item === 1
                    ? getBasePaginationLink(type, searchString)
                    : `${getPaginationLink(type, item, searchString)}`
                }
                isActive={item === page}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}
          {maxPage > 5 && page <= maxPage - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {maxPage > 1 && (
            <PaginationItem>
              <PaginationNext
                href={`${getPaginationLink(type, page + 1 <= maxPage ? page + 1 : page, searchString)}`}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}
