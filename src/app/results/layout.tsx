"use client";

import useUiState from "@/hooks/useUiState";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function ResultRayout({ children }: Props) {
  const { setIsDeleteButtonClicked, resetToDeletedUuid } = useUiState();

  useEffect(() => {
    return () => {
      setIsDeleteButtonClicked(false);
      resetToDeletedUuid();
    };
  }, [setIsDeleteButtonClicked, resetToDeletedUuid]);

  return <>{children}</>;
}
