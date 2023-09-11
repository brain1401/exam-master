"use client";
type Props = {
  problemCurrentIndex: number;
  problemsLength: number;
}
export default function CurrentCardIndicator({ problemCurrentIndex, problemsLength }: Props) {



  return (
    <p className="text-center mb-5 text-3xl">
      {problemCurrentIndex + 1}번째 문제 / 총 {problemsLength}개
    </p>
  );
}