export function arrayShuffle<T>(array: T[]) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
		// 무작위로 index 값 생성 (0 이상 i 미만)
    let j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}
