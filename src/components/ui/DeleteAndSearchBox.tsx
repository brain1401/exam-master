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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProblemSet,
  ProblemSetWithPagination,
  ResultWithCount,
  ResultsWithPagination,
} from "@/types/problems";

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
    userEmail,
    setResultsMaxPage,
    setProblemSetsMaxPage,
  } = usePagenationState();

  const queryClient = useQueryClient();

  const queryKey = [
    type === "results" ? "results" : "problemSets",
    type === "results" ? resultPage : problemSetsPage,
    defaultPageSize,
    searchString ?? "",
    null,
    userEmail,
  ];

  const { mutate: deleteData } = useMutation({
    mutationFn: async (params: {
      uuids: string[];
      dataType: "problemSet" | "problemResult";
    }) => {
      const { uuids, dataType } = params;
      if (uuids.length === 0) {
        alert("삭제할 문제집 또는 결과를 선택해주세요.");
        return;
      }
      const apiUrl =
        dataType === "problemSet"
          ? "/api/deleteProblemSetByUUID"
          : "/api/deleteProblemResultsByUUID";

      await axios.delete(apiUrl, { data: { uuids } });
    },
    onMutate: async (params: {
      uuids: string[];
      dataType: "problemSet" | "problemResult";
    }) => {
      const { uuids, dataType } = params;
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousData = queryClient.getQueryData<
        ProblemSetWithPagination | ResultsWithPagination
      >(queryKey);
      queryClient.setQueryData<
        ProblemSetWithPagination | ResultsWithPagination
      >(queryKey, (old) => {
        if (!old) {
          return old;
        }
        const tempSet = [
          ...old.data.filter((dat) => !uuids.includes(dat.uuid)),
        ] as ProblemSet[];
        const data = {
          ...old,
          data: tempSet,
        } as ProblemSetWithPagination | ResultsWithPagination;
        return data;
      });
      return { previousData };
    },
    onError: (err, params, context) => {
      queryClient.setQueryData<
        ProblemSetWithPagination | ResultsWithPagination
      >(queryKey, context?.previousData);
    },
    onSettled: async (data, error, params) => {
      const { dataType } = params;
      resetToDeletedUuid();
      const fetchFunction =
        dataType === "problemSet" ? fetchProblemSets : fetchExamResults;
      const page = dataType === "problemSet" ? problemSetsPage : resultPage;
      const setMaxPage =
        dataType === "problemSet" ? setProblemSetsMaxPage : setResultsMaxPage;
      const newData = await fetchFunction(
        "",
        page,
        defaultPageSize,
        setMaxPage,
      );
      if (newData?.data.length === 0) {
        const redirectUrl = searchString
          ? `/${type}/search/${searchString}/page/${Math.max(page - 1, 1)}`
          : `/${type}/page/${Math.max(page - 1, 1)}`;
        await revalidateAllPathAndRedirect(redirectUrl);
      }
      return await queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  const router = useRouter();

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
                  deleteData({
                    uuids: toDeletedUuid,
                    dataType:
                      type === "results" ? "problemResult" : "problemSet",
                  });

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
