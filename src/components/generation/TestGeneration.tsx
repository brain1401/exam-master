"use client";

import { Button } from "@/components/ui/button";
import { GenerateQuestionResponse } from "@/types/problems";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useTransition } from "react";
import { requestGeneratedProblemSet } from "@/actions/generateProblemsAction";
export default function TestGeneration() {
  const [isOCRLoading, setIsOCRLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [document, setDocument] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const serverAction = async () => {
      try {
        startTransition(async () => {
          const { error, success } = await requestGeneratedProblemSet({
            source: document,
          });

          if (success) {
            setIsSuccess(true);
          } else if (error) {
            throw new Error(error);
          }
        });
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        }
      }
    };

    if (document !== "") {
      serverAction();
      setDocument("");
    }
  }, [document]);

  return (
    <div className="flex flex-col items-center justify-center">
      {isSuccess && (
        <div>
          문제 생성 요청 성공! 5분 정도 후 내 문제 관리 메뉴로 가보세요.
        </div>
      )}

      <div className="mt-10 space-y-2">
        <Input
          type="file"
          className="cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file);
            }
          }}
        />
        <Button
          isLoading={isOCRLoading}
          onClick={async () => {
            if (!file) {
              alert("파일을 선택해주세요.");
              return;
            }
            try {
              setIsOCRLoading(true);

              const formData = new FormData();
              formData.append("file", file);

              const { data } = await axios.post("/api/getOCRResult", formData);

              console.log(data);
              setDocument(data);
            } catch (e) {
              if (e instanceof Error) {
                alert(e.message);
              }
            } finally {
              setIsOCRLoading(false);
            }
          }}
        >
          OCR
        </Button>
      </div>
    </div>
  );
}
