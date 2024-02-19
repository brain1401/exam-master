"use client";
import { useState } from "react";
import { isCardOnBeingWrited } from "@/service/problems";
import { Problem } from "@/types/problems";
import { Button, Input } from "@nextui-org/react";
import useProblems from "@/hooks/useProblems";

const BUTTON_CLASSNAMES =
  "ml-2 bg-[#1E90FF] text-white px-[.5rem] text-[.9rem]";

export default function ProblemsOption() {
  const {
    setProblemSetsName,
    localProblemSetsName,
    setLocalProblemSetsName,
    problems,
    setProblems,
    currentProblemIndex,
    setCurrentProblemIndex,
    problemLength,
    setProblemLength,
  } = useProblems();

  const [isLoading, setIsLoading] = useState(false);

  const handleProblemLengthChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setProblemLength(value);
  };

  const applyProblemLength = () => {
    const maxProblemLength = parseInt(problemLength); // 입력한 최대 문제 수
    if (maxProblemLength <= 0)
      return alert("최대 문제 수는 0보다 커야 합니다.");

    if (maxProblemLength > problems.length) {
      // 입력한 최대 문제 수가 cards 배열의 현재 길이보다 큰 경우, 나머지 값 만큼 null을 추가.
      setProblems([
        ...problems,
        ...Array<Problem>(maxProblemLength - problems.length).fill(null),
      ]);
    } else if (maxProblemLength < problems.length) {
      // 입력한 최재 문제 수가 cards 배열의 현재 길이보다 작은 경우, 배열의 마지막 항목을 삭제.

      if (
        problems
          .slice(maxProblemLength)
          .some((card) => isCardOnBeingWrited(card))
      ) {
        // 입력 중인 카드가 있을 경우
        const value = confirm(
          `${maxProblemLength}번 문제에서 ${problems.length}번 문제까지의 입력된 데이터가 삭제됩니다. 계속하시겠습니까?`,
        );
        if (value) {
          setProblems(problems.slice(0, maxProblemLength));
          let index = 0;

          if (currentProblemIndex >= maxProblemLength) {
            index = maxProblemLength - 1;
          } else {
            index = currentProblemIndex;
          }

          setCurrentProblemIndex(index);
        } else {
          setProblemLength(problems.length.toString());
        }
      } else {
        setProblems(problems.slice(0, maxProblemLength));
        let index = 0;

        if (currentProblemIndex >= maxProblemLength) {
          index = maxProblemLength - 1;
        } else {
          index = currentProblemIndex;
        }

        setCurrentProblemIndex(index);
      }
    }
  };

  const applyProblemSetName = async () => {
    if (localProblemSetsName === "") {
      alert("문제집 이름은 빈 문자열이 될 수 없습니다.");
      setLocalProblemSetsName("");
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetch(
        `/api/checkProblemSetName?name=${localProblemSetsName.trim()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!result.ok) {
        alert(
          "문제집 이름을 확인하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        );
        return;
      }
      const isAlreadyExistName = await result.json();

      if (isAlreadyExistName) {
        alert("이미 존재하는 문제집 이름입니다.");
        setLocalProblemSetsName("");
        return;
      }

      setProblemSetsName(localProblemSetsName.trim());
      alert("문제집 이름이 적용되었습니다.");
    } catch (err) {
      alert(
        "문제집 이름을 확인하는 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-5 flex w-full flex-col gap-2">
      <div className="flex items-center">
        <Input
          id="maxIndex"
          className="w-fit text-center"
          classNames={{
            inputWrapper: "px-[.5rem] w-[3rem]",
            input: "text-center",
            label: "text-sm md:text-md z-0",
          }}
          label="최대 문제 수"
          labelPlacement="outside-left"
          value={problemLength}
          variant="bordered"
          size="sm"
          onChange={handleProblemLengthChange}
        />
        <Button
          className={BUTTON_CLASSNAMES}
          size="sm"
          onClick={applyProblemLength}
        >
          확인
        </Button>
      </div>
      <div className="flex items-center">
        <Input
          id="problemSetName"
          className="w-fit text-center"
          classNames={{
            inputWrapper: "px-[.5rem] w-[10rem]",
            label: " text-sm md:text-md z-0",
          }}
          label="문제집 이름"
          labelPlacement="outside-left"
          variant="bordered"
          size="sm"
          value={localProblemSetsName}
          onChange={(e) => setLocalProblemSetsName(e.target.value)}
        />
        <Button
          className={BUTTON_CLASSNAMES}
          onClick={applyProblemSetName}
          size="sm"
          isLoading={isLoading}
        >
          {isLoading ? "" : "확인"}
        </Button>
      </div>
    </div>
  );
}
