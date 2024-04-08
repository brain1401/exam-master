import { Button } from "./button";
import { MdOutlineDeleteForever } from "react-icons/md";
import SearchBox from "./SearchBox";
import useUiState from "@/hooks/useUiState";
import axios from "axios";
import { cn } from "@/lib/utils";
import useRevalidation from "@/hooks/useRevalidate";
import usePagenationState from "@/hooks/usePagenationState";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
  type: "manage" | "exam" | "results";
};

export default function DeleteAndSearchBox({
  searchString,
  setSearchString,
  type,
}: Props) {
  const { revalidateAllPathAndRedirect } = useRevalidation();
  const {
    isDeleteButtonClicked,
    setIsDeleteButtonClicked,
    resetToDeletedUuid,
    toDeletedUuid,
  } = useUiState();

  const queryClient = useQueryClient();

  const { resultPage, problemSetsPage } = usePagenationState();

  const getRedirectUrl = (page: number, type: string, searchString: string) => {
    const redirectPage = Math.max(page - 1, 1);
    const baseUrl = `/${type}`;
    const searchUrl = `/search/${searchString}`;
    const pageUrl = `/page/${redirectPage}`;

    if (searchString) {
      return redirectPage === 1
        ? `${baseUrl}${searchUrl}`
        : `${baseUrl}${searchUrl}${pageUrl}`;
    } else {
      return redirectPage === 1 ? baseUrl : `${baseUrl}${pageUrl}`;
    }
  };

  const getQueryKey = () => {
    return type === "results" ? "results" : "problemSets";
  };

  const deleteItems = async (
    uuids: string[],
    dataType: "problemSet" | "problemResult",
  ) => {
    if (uuids.length === 0) {
      alert("삭제할 문제집 또는 결과를 선택해주세요.");
      return;
    }

    try {
      const page = dataType === "problemSet" ? problemSetsPage : resultPage;

      const apiUrl =
        dataType === "problemSet"
          ? "/api/deleteProblemSetByUUID"
          : "/api/deleteProblemResultsByUUID";

      await axios.delete(apiUrl, { data: { uuids } });

      resetToDeletedUuid();

      const redirectUrl = getRedirectUrl(page, type, searchString);
      console.log(redirectUrl);

      queryClient.invalidateQueries({ queryKey: [getQueryKey()] });

      revalidateAllPathAndRedirect(redirectUrl);
    } catch (e) {
      if (e instanceof Error) {
        alert("문제를 삭제하는 중 오류가 발생했습니다.");
      }
      throw e;
    }
  };

  const onClick = () => {
    setIsDeleteButtonClicked(!isDeleteButtonClicked);

    // 토글 해제 시 선택된 삭제할 문제집 초기화
    if (isDeleteButtonClicked) {
      resetToDeletedUuid();
    }
  };

  return (
    <div className="flex justify-between">
      <div className="relative flex flex-col gap-x-[.2rem] md:flex-row md:items-center md:justify-center md:gap-x-[1rem]">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            `ml-[1rem] md:ml-[8vw]`,
            `${isDeleteButtonClicked && "brightness-[80%]"}`,
            `${type === "exam" && "pointer-events-none opacity-0"}`,
          )}
          onClick={onClick}
        >
          <MdOutlineDeleteForever size={24} />
        </Button>

        {isDeleteButtonClicked && (
          <div className="absolute top-full mt-2 flex flex-row gap-x-[1rem] md:static md:mt-0">
            {isDeleteButtonClicked && (
              <Button
                className="px-6 py-2"
                onClick={async () => {
                  setIsDeleteButtonClicked(false);

                  await deleteItems(
                    toDeletedUuid,
                    type === "results" ? "problemResult" : "problemSet",
                  );
                }}
              >
                삭제
              </Button>
            )}
            {isDeleteButtonClicked && (
              <Button
                className="px-6 py-2"
                onClick={() => {
                  resetToDeletedUuid();
                  setIsDeleteButtonClicked(false);
                }}
              >
                취소
              </Button>
            )}
          </div>
        )}
      </div>

      <SearchBox
        type={type}
        searchString={searchString}
        setSearchString={setSearchString}
      />
    </div>
  );
}
