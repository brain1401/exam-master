"use client";

import { Button } from "@/components/ui/button";
import { GenerateQuestionResponse } from "@/types/problems";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

export default function TestGeneration() {
  const [generateQuestionResponse, setGenerateQuestionResponse] =
    useState<GenerateQuestionResponse | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isOCRLoading, setIsOCRLoading] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);

  const [step, setStep] = useState<number>(1);

  const [document, setDocument] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);

        const res = await axios.post<GenerateQuestionResponse>(
          "/api/generateProblemsClaude",
          {
            source: document,
          },
        );
        const data = res.data;

        if (data === null) {
          alert("문제를 생성하는데 실패했습니다..");
        } else {
          setGenerateQuestionResponse(data);
        }
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        }
      } finally {
        setIsLoading(false);
        setStep(1);
      }
    };

    if (document !== "") {
      fetch();
    }
  }, [document]);

  useEffect(() => {
    console.log("generateQuestionResponse :", {
      ...generateQuestionResponse,
      questions: generateQuestionResponse?.questions?.toSorted((a, b) =>
        a.question < b.question ? -1 : 1,
      ),
    });
  }, [generateQuestionResponse]);

  return (
    <div className="flex flex-col items-center justify-center">
      
      {isLoading && <div>로딩중... {`단계 ${step}`}</div>}
      <div>{generateQuestionResponse?.questions?.toString()}</div>

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
