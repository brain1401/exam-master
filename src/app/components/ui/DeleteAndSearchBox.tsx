"use client";

import { Button } from "@nextui-org/react";
import { MdOutlineDeleteForever } from "react-icons/md";
import SearchBox from "./SearchBox";
import useUiState from "@/hooks/useUiState";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

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

    await Promise.all(
      uuids.map(async (uuid) => {
        const res = await axios.delete(`/api/deleteProblemSetByUUID/${uuid}`);
        return res;
      }),
    );

    queryClient.invalidateQueries({ queryKey: ["problemSets"] });

    resetToDeletedUuid();
  };

  const deleteProblemResults = async (uuids: string[]) => {
    if (uuids.length === 0) return alert("삭제할 문제집을 선택해주세요.");

    await Promise.all(
      uuids.map(async (uuid) => {
        const res = await axios.delete(
          `/api/deleteProblemResultsByUUID/${uuid}`,
        );
        return res;
      }),
    );

    queryClient.invalidateQueries({ queryKey: ["results"] });

    resetToDeletedUuid();
  };

  const deleteProblem =
    type === "exam" || type === "manage"
      ? deleteProblemSets
      : deleteProblemResults;

  return (
    <div className="flex justify-between">
      <div className="flex items-center justify-center gap-x-[.2rem] md:gap-x-[1rem]">
        <Button
          isIconOnly
          className={twMerge(
            `ml-[1rem] md:ml-[8vw]`,
            `${isDeleteButtonClicked && "brightness-[80%]"}`,
          )}
          onClick={onClick}
        >
          <MdOutlineDeleteForever size={24} />
        </Button>
        {isDeleteButtonClicked && (
          <Button className="" onClick={() => deleteProblem(toDeletedUuid)}>
            삭제
          </Button>
        )}
      </div>

      <SearchBox
        searchString={searchString}
        setSearchString={setSearchString}
      />
    </div>
  );
}
