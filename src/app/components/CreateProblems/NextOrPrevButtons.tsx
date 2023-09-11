"use client";
type Props = {
  setCurrentProblemIndex: React.Dispatch<React.SetStateAction<number>>;
  problemLength: number;
};
export default function NextOrPrevButtons({
  setCurrentProblemIndex,
  problemLength,
}: Props) {
  const showNextCard = () => {
    setCurrentProblemIndex((prevIndex) => {
      if (prevIndex < problemLength - 1) {
        window.scrollTo(0, 0);
        return prevIndex + 1;
      } else {
        return prevIndex;
      }
    });
  };

  const showPreviousCard = () => {
    setCurrentProblemIndex((prevIndex) => {
      if (prevIndex !== 0) {
        window.scrollTo(0, 0);
        return prevIndex - 1;
      } else {
        return prevIndex;
      }
    });
  };

  return (
    <div className="flex justify-center mt-8 gap-5">
      <button
        onClick={showPreviousCard}
        className="px-5 py-2 border border-black rounded-md hover:bg-slate-300 hover:border-slate-300"
      >
        이전
      </button>
      <button
        onClick={showNextCard}
        className="px-5 py-2 border border-black rounded-md hover:bg-slate-300 hover:border-slate-300"
      >
        다음
      </button>
    </div>
  );
}
