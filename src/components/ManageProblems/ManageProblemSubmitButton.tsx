"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import useProblems from "@/hooks/useProblems";
import {
  analyzeProblemsImagesAndDoCallback,
  generateFileHash,
  getPresignedUrlOnS3,
  isImageFileObject,
  isPresignedPost,
  isProblemEmpty,
} from "@/utils/problems";
import axios from "axios";
import { UpdateProblemsSetData } from "@/types/problems";
type Props = {
  uuid: string;
};
export default function ManageProblemSubmitButton({ uuid }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    problems,
    problemSetsName,
    problemSetIsPublic,
    timeLimit,
    description,
  } = useProblems();

  const handleSubmit = async () => {
    if (problems.some((problem) => isProblemEmpty(problem))) {
      alert("문제와 선택지를 전부 입력했는지 확인해주세요.");
      return;
    }
    if (problemSetsName === "") {
      alert("문제집 이름을 입력해주세요.");
      return;
    }

    if (!confirm("문제집을 제출하시겠습니까?")) return;

    setIsLoading(true); // 로딩 시작
    try {
      console.time("processImagesAndUpload");
      const uploadedImages = await analyzeProblemsImagesAndDoCallback({
        problems,
        flatResult: false,
        skipDuplicated: false,
        callback: async ({
          index,
          imageFile,
          imageKey,
          isNoImage,
          isFirstImage,
        }) => {
          if (!isNoImage && isFirstImage) {
            // 이미지가 있으면서 배열 내 첫 이미지인 경우

            if (imageFile && isImageFileObject(imageFile)) {
              const key = `${await generateFileHash(imageFile)}-${imageFile.name}`;

              const result = await getPresignedUrlOnS3(key, () => {
                return {
                  index,
                  imageKey: key,
                };
              });
              if (!result) {
                throw new Error("이미지 업로드에 실패했습니다.");
              }

              if (isPresignedPost(result)) {
                const { fields, url } = result;
                const formData = new FormData();
                Object.entries(fields).forEach(([field, value]) => {
                  formData.append(field, value);
                });
                formData.append("Content-Type", imageFile.type);
                formData.append("file", imageFile);

                await axios.post(url, formData, {
                  validateStatus: (status) => status < 400,
                });

                return {
                  index,
                  imageKey: key,
                };
              } else {
                // 이미 해당 키를 가진 이미지가 존재하는 경우
                return result;
              }
            } else if (imageKey) {
              return {
                index,
                imageKey: imageKey,
              };
            }
          } else if (!isNoImage) {
            // 이미지가 있는 경우
            return {
              index,
              imageKey: imageKey ?? null,
            };
          } else if (isNoImage) {
            // 이미지가 없는 경우
            return {
              index,
              imageKey: null,
            };
          }
        },
      });
      console.timeEnd("processImagesAndUpload");
      console.log("uploadedImages : ", uploadedImages);

      const data: UpdateProblemsSetData = {
        problems: problems.map((problem, index) => {
          const imageKey = uploadedImages[index]?.imageKey;
          
          return {
            ...(problem as NonNullable<typeof problem>),
            image: imageKey ? { key: imageKey } : null,
          };
        }),
        problemSetName: problemSetsName,
        problemSetIsPublic,
        timeLimit,
        description,
        problemSetUUID: uuid,
      };

      try {
        const response = await axios.put("/api/updateProblems", data);

        const result = response.data;

        if (result === true) {
          alert("문제집이 성공적으로 등록되었습니다.");
        } else {
          alert(`문제집 등록에 실패했습니다.`);
        }
      } catch (err) {
        alert(`문제집 등록에 실패했습니다. \n에러 : ${err}`);
      } finally {
        setIsLoading(false); // 로딩 완료
      }
    } catch (err) {
      alert(`이미지 업로드에 실패했습니다. \n에러 : ${err}`);
      throw err;
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };
  return (
    <div className="mt-3 flex justify-center">
      <Button
        onClick={handleSubmit}
        isLoading={isLoading}
        className="w-[7rem] px-8 py-1"
      >
        {isLoading ? "수정 중..." : "수정"}
      </Button>
    </div>
  );
}
