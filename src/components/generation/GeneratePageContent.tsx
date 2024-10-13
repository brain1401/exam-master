"use client";

import { useEffect, useState } from "react";
import GenerateProblems from "@/components/generation/GenerateProblems";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CopyableText from "@/components/ui/CopyableText";

type GeneratePageContentProps = {
  email: string | null;
};

export default function GeneratePageContent({
  email,
}: GeneratePageContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const lastSeenDate = localStorage.getItem("lastSeenGenerateDialog");
    const today = new Date().toDateString();

    if (
      !lastSeenDate ||
      lastSeenDate !== today ||
      process.env.NODE_ENV === "development"
    ) {
      setIsDialogOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    const today = new Date().toDateString();
    localStorage.setItem("lastSeenGenerateDialog", today);
    setIsDialogOpen(false);
  };

  return (
    <>
      <GenerateProblems />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI 문제 생성 안내</DialogTitle>
            <DialogDescription>
              AI를 이용한 문제 생성 기능에 대한 중요한 안내사항입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="whitespace-pre-line">
              {
                "AI 문제 생성 기능은 지속적으로 개선 중입니다.\n 다음 사항에 유의해 주시기 바랍니다."
              }
            </p>
            <ul className="space-y-3">
              {[
                "생성된 문제는 완벽하지 않을 수 있습니다.",
                "생성 완료 후, 반드시 '내 문제 관리' 페이지에서 생성된 문제들을 검토해 주세요.",
                "필요한 경우 문제를 수정하거나 보완할 수 있습니다.",
                "검토 과정은 최종 문제의 품질을 높이는 데 중요합니다.",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-3 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <p>
              여러분의 피드백은 AI 문제 생성 기능을 개선하는 데 큰 도움이
              됩니다. 피드백은 <CopyableText text="brain1401@gmail.com" />
              으로 보내주시기 바랍니다. 감사합니다!
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirm}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
