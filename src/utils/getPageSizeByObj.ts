import { defaultPageSize } from "@/const/pageSize";

export default function getPageSizeByObj({
  isXxs,
  isXs,
  isSm,
  isMd,
  isLg,
  isXl,
}: {
  isXxs: boolean;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
}) {
  let result = 0;
  if (isXxs) {
    result = 2;
  } else if (isXs) {
    result = 4;
  } else if (isSm) {
    result = 4;
  } else if (isMd) {
    result = 6;
  } else if (isLg) {
    result = defaultPageSize;
  } else if (isXl) {
    result = 10;
  }

  return result;
}
