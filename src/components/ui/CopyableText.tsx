"use client";

import { useToast } from "@/components/ui/use-toast";

type CopyableTextProps = {
  text: string;
  displayText?: string;
  successMessage?: string;
  className?: string;
};

export default function CopyableText({ 
  text, 
  displayText, 
  successMessage = "텍스트가 복사되었습니다.",
  className = "cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-500"
}: CopyableTextProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: successMessage,
        description: text,
        duration: 2000,
      });
    });
  };

  return (
    <span
      onClick={handleCopy}
      className={className}
    >
      {displayText || text}
    </span>
  );
}
