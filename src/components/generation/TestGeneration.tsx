"use client";

import { Button } from "@/components/ui/button";
import { CreateOption, GenerateQuestionResponse } from "@/types/problems";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
export default function TestGeneration() {
  const [createOption, setCreateOption] = useState<CreateOption>("default");

  const [isOCRLoading, setIsOCRLoading] = useState<boolean>(false);
  const [isOncePressed, setIsOncePressed] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const generate = async (source: string) => {
    try {
      setIsSuccess(false);

      await axios.post("/api/generateProblemsCohere", {
        source,
        createOption,
      });
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    } finally {
      setIsSuccess(true);
    }
  };

  useEffect(() => {
    if (isOCRLoading) {
      setIsOncePressed(true);
    }
  }, [isOCRLoading]);

  useEffect(() => {
    console.log("createOption :", createOption);
  }, [createOption]);

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

              await generate(data);
              setIsSuccess(true);
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

        <RadioGroup
          value={createOption}
          onValueChange={(value) => {
            setCreateOption(value as "obj" | "sub" | "default");
          }}
          defaultValue="default"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="default" />
            <Label htmlFor="default">기본</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="obj" id="obj" />
            <Label htmlFor="obj">객관식만 생성</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sub" id="sub" />
            <Label htmlFor="sub">주관식만 생성</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
