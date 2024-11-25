"use client";

import { Button } from "@/components/ui/button";
import { CreateOption } from "@/types/problems";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CopyableText from "../ui/CopyableText";
import { redirect } from "next/navigation";

export default function TestGeneration() {
  const [createOption, setCreateOption] = useState<CreateOption>("default");

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isOncePressed, setIsOncePressed] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const generate = async (source: string) => {
    try {
      setIsSuccess(false);

      await axios.post("/api/generateProblemsClaude", {
        ...(createOption === "existing" ? { source } : { topics: source }),
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
    if (isGenerating) {
      setIsOncePressed(true);
    }
  }, [isGenerating]);

  useEffect(() => {
    console.log("createOption :", createOption);
  }, [createOption]);

  const handleGenerateClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmGenerate = async () => {
    setIsDialogOpen(false);

    try {
      const { data } = await axios.get("/api/getGenerationLimit");

      if (!data.canGenerate) {
        redirect("/generate/limit-reached");
      }

      if (!file) {
        alert("파일을 선택해주세요.");
        return;
      }

      setIsGenerating(true);

      const formData = new FormData();
      formData.append("file", file);

      const { data: ocrData } = await axios.post("/api/getOCRResult", formData);

      await generate(ocrData);
      setIsSuccess(true);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleGenerateClick}
              isLoading={isGenerating}
              disabled={isOncePressed || !file}
            >
              문제 생성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>AI 문제 생성 후원 안내</DialogTitle>
              <DialogDescription>
                AI를 이용한 문제 생성에는 상당한 비용이 소요됩니다. 여러분의
                소중한 후원이 서비스의 지속적인 운영과 발전에 큰 힘이 됩니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>
                AI 문제 생성 기능 추가로 인한 비용 증가와 홈페이지의 안정적인
                운영을 위해 여러분의 후원이 절실히 필요합니다.
              </p>
              <p>
                자취하는 대학생의 열정 프로젝트를 응원해 주시는 의미로써 커피 한
                잔 사 먹으라는 의미로 1000원 이라도 후원해 주시면 정말
                감사하겠습니다. 작은 금액이라도 정말!! 큰 도움이 됩니다.ㅠㅠ
              </p>
              <p className="font-semibold">
                후원 계좌 : 토스뱅크 <CopyableText text="1000-2767-1869" />{" "}
                (예금주: ㅎㅌㄱ)
              </p>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                돌아가기
              </Button>
              <Button onClick={handleConfirmGenerate}>
                후원 없이 계속하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <RadioGroup
          value={createOption}
          onValueChange={(value) => {
            setCreateOption(value as CreateOption);
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
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existing" id="existing" />
            <Label htmlFor="existing">기존 문제 변환</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
