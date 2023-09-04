"use client";
import Image from "next/image";

type Props = {
  isAdditiondalViewButtonClicked: boolean;
  isImageButtonClicked: boolean;
  additionalView: string;
  setImageURL: (url: string | null) => void;
  setCurrentCardImage: (image: File | null) => void;
  imageURL: string | null;
  setCurrentCard: (card: Partial<Props>) => void;
};
export default function AddViewAndPhoto({
  isAdditiondalViewButtonClicked,
  isImageButtonClicked,
  additionalView,
  imageURL,
  setImageURL,
  setCurrentCardImage,
  setCurrentCard,
}: Props) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const MAX_FILE_SIZE = 9 * 1024 * 1024; // 9MB

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("파일 크기는 9MB를 초과할 수 없습니다.");
        return;
      }

      if (file.type.startsWith("image/")) {
        if (imageURL) {
          // 이전 이미지 URL 해제
          URL.revokeObjectURL(imageURL);
        }
        const newURL = URL.createObjectURL(file);
        setImageURL(newURL); // 이미지 URL 상태를 업데이트
        setCurrentCardImage(file);
      } else {
        alert("이미지 파일을 선택해주세요.");
      }
    }
  };


  return (
    <>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          className={`${
            isAdditiondalViewButtonClicked
              ? "border border-neutral-500 bg-neutral-500 text-white"
              : "border border-gray-300"
          }  rounded-md px-5 py-2`}
          onClick={() => {
            if (isAdditiondalViewButtonClicked && additionalView !== "") {
              if (!confirm("보기를 지우시겠습니까?")) return;
              setCurrentCard({
                additionalView: "",
              });
              setCurrentCard({
                isAdditiondalViewButtonClicked: !isAdditiondalViewButtonClicked,
              });
            } else {
              setCurrentCard({
                isAdditiondalViewButtonClicked: !isAdditiondalViewButtonClicked,
              });
            }
          }}
        >
          보기 추가
        </button>

        <button
          type="button"
          className={`${
            isImageButtonClicked
              ? "border border-neutral-500 bg-neutral-500 text-white"
              : "border border-gray-300"
          }  rounded-md px-5 py-2`}
          onClick={() => {
            if (isImageButtonClicked && imageURL) {
              if (!confirm("이미지를 지우시겠습니까?")) return;

              imageURL && URL.revokeObjectURL(imageURL);
              setImageURL(null);
              setCurrentCardImage(null);
              setCurrentCard({
                isImageButtonClicked: !isImageButtonClicked,
              });
            } else {
              setCurrentCard({
                isImageButtonClicked: !isImageButtonClicked,
              });
            }
          }}
        >
          사진 추가
        </button>
      </div>

      {isImageButtonClicked || imageURL ? (
        <div>
          <p
            className="text-lg font-semibold"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            사진
          </p>
          <div className="my-2 flex items-center">
            <input
              type="file"
              id="image"
              accept="image/*"
              className="absolute opacity-0 w-0 h-0"
              onChange={handleImageChange}
            />
            <label
              htmlFor="image"
              className="px-4 py-2 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 rounded-md"
            >
              사진 선택
            </label>
          </div>
          {imageURL && (
            <Image
              src={imageURL ?? ""}
              alt="image"
              width={400}
              height={200}
              className="mb-3"
            />
          )}
        </div>
      ) : null}
      {isAdditiondalViewButtonClicked || additionalView ? (
        <div>
          <label
            htmlFor="additional-info"
            className="text-lg font-semibold mb-3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            보기
          </label>
          <textarea
            id="additional-info"
            className="w-full resize-none h-[6rem] border border-gray-300 rounded-md p-2 my-2"
            placeholder="나 이번 시험 너무 못 봤어. 평균 99점이 조금 안 되네"
            value={additionalView}
            onChange={(e) => {
              setCurrentCard({
                additionalView: e.target.value,
              });
            }}
          />
        </div>
      ) : null}
    </>
  );
}
