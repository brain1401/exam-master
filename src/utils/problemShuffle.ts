import { Problem } from "@/types/problems";

export function problemShuffle(array: Problem[]) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  newArray.forEach((problem) => {
    if (!problem?.candidates) return;

    for (let i = problem.candidates.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [problem.candidates[i], problem.candidates[j]] = [
        problem.candidates[j],
        problem.candidates[i],
      ];
    }
  });

  return newArray;
}
