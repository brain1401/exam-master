"use client";
type Props = {
  problemCurrentIndex: number;
  problemsLength: number;
};
export default function CurrentCardIndicator({
  problemCurrentIndex,
  problemsLength,
}: Props) {
  return (
    <p className="mb-5 text-center text-3xl">
      {problemCurrentIndex + 1}번째 문제 / 총 {problemsLength}개
    </p>
  );
}
