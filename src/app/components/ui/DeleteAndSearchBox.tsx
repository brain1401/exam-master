import { Button } from "./button";
import { MdOutlineDeleteForever } from "react-icons/md";
import SearchBox from "./SearchBox";
import useUiState from "@/hooks/useUiState";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import useRevalidate from "@/hooks/useRevalidate";

type Props = {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
  type: "manage" | "exam" | "result";
};

export default function DeleteAndSearchBox({
  searchString,
  setSearchString,
  type,
}: Props) {
  const queryClient = useQueryClient();
  const { revalidateAllPath } = useRevalidate();
  const {
    isDeleteButtonClicked,
    setIsDeleteButtonClicked,
    resetToDeletedUuid,
    toDeletedUuid,
  } = useUiState();

  // 언마운트 시 초기화
  useEffect(() => {
    return () => {
      setIsDeleteButtonClicked(false);
      resetToDeletedUuid();
    };
  }, [setIsDeleteButtonClicked, resetToDeletedUuid]);

  const onClick = () => {
    setIsDeleteButtonClicked(!isDeleteButtonClicked);

    // 토글 해제 시 선택된 삭제할 문제집 초기화
    if (isDeleteButtonClicked) {
      resetToDeletedUuid();
    }
  };

  const deleteProblemSets = async (uuids: string[]) => {
    if (uuids.length === 0) return alert("삭제할 문제집을 선택해주세요.");

    const res = await axios.delete(`/api/deleteProblemSetByUUID`, {
      data: { uuids },
    });

    queryClient.invalidateQueries({ queryKey: ["problemSets"] });

    resetToDeletedUuid();
  };

  const deleteProblemResults = async (uuids: string[]) => {
    if (uuids.length === 0) return alert("삭제할 문제집을 선택해주세요.");

    const res = await axios.delete(`/api/deleteProblemResultsByUUID`, {
      data: {
        uuids,
      },
    });

    queryClient.invalidateQueries({ queryKey: ["results"] });

    resetToDeletedUuid();
  };

  const deleteProblem =
    type === "exam" || type === "manage"
      ? deleteProblemSets
      : deleteProblemResults;

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-x-[.2rem] md:flex-row md:items-center md:justify-center md:gap-x-[1rem]">
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
          <div className="mt-2 flex flex-row gap-x-[1rem] md:mt-0">
            {isDeleteButtonClicked && (
              <Button
                className="px-6 py-2"
                onClick={() => {
                  deleteProblem(toDeletedUuid);
                  revalidateAllPath();
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
        searchString={searchString}
        setSearchString={setSearchString}
      />
    </div>
  );
}
