"use client";
import { useState } from "react";
import { isCardOnBeingWrited } from "@/service/problems";
import { Problem } from "@/types/problems";
import Button from "../ui/Button";
type Props = {
  problems: Problem[];
  setProblems: React.Dispatch<React.SetStateAction<Problem[]>>;
  problemSetsName: string;
  setProblemSetsName: React.Dispatch<React.SetStateAction<string>>;
  setProblemCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
};
export default function EditProblemsOption({
  problems,
  setProblems,
  problemSetsName,
  setProblemSetsName,
  setProblemCurrentIndex,
}: Props) {
  const [localProblemSetsName, setLocalProblemSetsName] =
    useState(problemSetsName);
  const [cardsLength, setCardsLength] = useState(
    problems.length.toString() ?? "10"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleCardLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardsLength(value);
  };

  const applyCardLength = () => {
    const maxProblemLength = parseInt(cardsLength); // 입력한 최대 문제 수
    if (maxProblemLength <= 0)
      return alert("최대 문제 수는 0보다 커야 합니다.");

    if (maxProblemLength > problems.length) {
      // 입력한 최대 문제 수가 cards 배열의 현재 길이보다 큰 경우, 나머지 값 만큼 null을 추가.
      setProblems((prevCards) => [
        ...prevCards,
        ...Array<Problem>(maxProblemLength - prevCards.length).fill(null),
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
          `${maxProblemLength}번 문제에서 ${problems.length}번 문제까지의 입력된 데이터가 삭제됩니다. 계속하시겠습니까?`
        );
        if (value) {
          setProblems((prevCards) => prevCards.slice(0, maxProblemLength));
          setProblemCurrentIndex((prev) => {
            if (prev >= maxProblemLength) {
              return maxProblemLength - 1;
            } else {
              return prev;
            }
          });
        }
      } else {
        setProblems((prevCards) => prevCards.slice(0, maxProblemLength));
        setProblemCurrentIndex((prev) => {
          if (prev >= maxProblemLength) {
            return maxProblemLength - 1;
          } else {
            return prev;
          }
        });
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
        }
      );
      if (!result.ok) {
        alert(
          "문제집 이름을 확인하는 중 오류가 발생했습니다. 다시 시도해주세요."
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
        "문제집 이름을 확인하는 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col gap-2 mb-5">
        <div>
          <label htmlFor="maxIndex" className="ml-5 mr-2">
            최대 문제 수 :
          </label>
          <input
            id="maxIndex"
            className="border border-black p-1 text-center w-[3rem] rounded-md"
            value={cardsLength}
            onChange={handleCardLengthChange}
          />
          <Button className="ml-2 px-5 py-1" onClick={applyCardLength}>
            확인
          </Button>
        </div>
        <div>
          <label htmlFor="problemSetName" className="ml-5 mr-2">
            문제집 이름 :
          </label>
          <input
            id="problemSetName"
            className="border w-[10rem] border-black p-1 rounded-md"
            value={localProblemSetsName}
            onChange={(e) => setLocalProblemSetsName(e.target.value)}
          />
          <Button
            className="ml-2 px-5 py-1"
            onClick={applyProblemSetName}
            disabled={isLoading}
          >
            {isLoading ? "중복 확인 중..." : "확인"}
          </Button>
        </div>
      </div>
    </form>
  );
}
