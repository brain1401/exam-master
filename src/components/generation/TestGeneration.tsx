"use client";

import { Button } from "@/components/ui/button";
import { GenerateQuestionResponse } from "@/types/problems";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
export default function TestGeneration() {
  const [isOCRLoading, setIsOCRLoading] = useState<boolean>(false);
  const [isOncePressed, setIsOncePressed] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [document, setDocument] = useState<string>("");

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsSuccess(false);

        await axios.post("/api/generateProblemsClaude", {
          source: document,
        });
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        }
      } finally {
        setIsSuccess(true);
      }
    };

    if (document !== "") {
      fetch();
      setDocument("");
    }
  }, [document]);

  useEffect(() => {
    if (isOCRLoading) {
      setIsOncePressed(true);
    }
  }, [isOCRLoading]);

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
          disabled={isOncePressed}
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
