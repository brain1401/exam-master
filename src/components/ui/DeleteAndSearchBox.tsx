import { Button } from "./button";
import { MdOutlineDeleteForever } from "react-icons/md";
import SearchBox from "./SearchBox";
import useUiState from "@/hooks/useUiState";
import axios from "axios";
import { cn } from "@/lib/utils";
import useRevalidation from "@/hooks/useRevalidate";
import usePagenationState from "@/hooks/usePagenationState";
import { useRouter } from "next/navigation";
import { fetchExamResults, fetchProblemSets } from "@/utils/problems";
import { defaultPageSize } from "@/const/pageSize";

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
  const { revalidateAllPath, revalidateAllPathAndRedirect } = useRevalidation();
  const {
    isDeleteButtonClicked,
    setIsDeleteButtonClicked,
    resetToDeletedUuid,
    toDeletedUuid,
  } = useUiState();

  const {
    resultPage,
    problemSetsPage,
    setResultsMaxPage,
    setProblemSetsMaxPage,
  } = usePagenationState();

  const router = useRouter();

  const onClick = () => {
    setIsDeleteButtonClicked(!isDeleteButtonClicked);

    // 토글 해제 시 선택된 삭제할 문제집 초기화
    if (isDeleteButtonClicked) {
      resetToDeletedUuid();
    }
  };

  const deleteProblemSets = async (uuids: string[]) => {
    if (uuids.length === 0) return alert("삭제할 문제집을 선택해주세요.");

    await axios.delete(`/api/deleteProblemSetByUUID`, {
      data: { uuids },
    });

    resetToDeletedUuid();

    // 삭제 후 문제집 데이터 가져오기
    const problemSets = await fetchProblemSets(
      "",
      problemSetsPage,
      defaultPageSize,
      setProblemSetsMaxPage,
    );

    // 현재 페이지에 문제집이 없는 경우
    if (problemSets?.data.length === 0) {
      const redirectUrl = searchString
        ? `/${type}/search/${searchString}/page/${Math.max(problemSetsPage - 1, 1)}`
        : `/${type}/page/${Math.max(problemSetsPage - 1, 1)}`;
      await revalidateAllPathAndRedirect(redirectUrl);
    }
  };

  const deleteProblemResults = async (uuids: string[]) => {
    if (uuids.length === 0) return alert("삭제할 문제집을 선택해주세요.");

    await axios.delete(`/api/deleteProblemResultsByUUID`, {
      data: {
        uuids,
      },
    });

    resetToDeletedUuid();

    // 삭제 후 결과 데이터 가져오기
    const results = await fetchExamResults(
      "",
      resultPage,
      defaultPageSize,
      setResultsMaxPage,
    );

    // 현재 페이지에 결과가 없는 경우
    if (results?.data.length === 0) {
      const redirectUrl = searchString
        ? `/${type}/search/${searchString}/page/${Math.max(resultPage - 1, 1)}`
        : `/${type}/page/${Math.max(resultPage - 1, 1)}`;
      await revalidateAllPathAndRedirect(redirectUrl);
    }
  };

  const deleteProblem =
    type === "exam" || type === "manage"
      ? deleteProblemSets
      : deleteProblemResults;

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
                  await deleteProblem(toDeletedUuid);

                  setIsDeleteButtonClicked(false);

                  // 다음 navigation 시 Router Cache (클라이언트 캐시)를 무효화
                  await revalidateAllPath();

                  router.refresh();
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
