"use client";
export default function MakeError() {
  return (
    <div className="flex justify-center">
      <button className="px-2 py-2 rounded-md bg-red-500 text-white" onClick={
        () => {
          throw new Error("버튼을 눌러 에러를 발생시켰습니다.");
        }
      }>에러 발생시키기</button>
    </div>
  );
}
