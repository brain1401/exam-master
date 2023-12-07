"use client";
import { Button } from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  Header: React.ReactNode;
  className?: string;
  width?: string;
  height?: string;
  buttonName: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function Modal({
  children,
  className,
  buttonName,
  width,
  height,
  Header,
  onConfirm,
  onCancel,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <>
      <Button
        className={className}
        size="sm"
        onClick={() => setIsModalOpen(true)}
        radius="sm"
      >
        {buttonName}
      </Button>

      {isModalOpen &&
        createPortal(
          <div
            className={`fixed left-0 top-0 z-[999] flex h-full w-full pt-[20vh] justify-center bg-black bg-opacity-50`}
          >
            <div
              ref={modalRef}
              className={twMerge(
                `flex h-fit w-fit flex-col items-center justify-center rounded-xl border border-gray-400 bg-neutral-100 p-5`,
                [width, height],
              )}
            >
              <div>{Header}</div>
              <div className="flex-1">{children}</div>
              <div className="flex w-full items-center justify-center gap-x-5">
                <Button
                  className="bg-primary-400 text-white"
                  onClick={() => {
                    onConfirm && onConfirm();
                    setIsModalOpen(false);
                  }}
                >
                  확인
                </Button>
                <Button
                  onClick={() => {
                    onCancel && onCancel();
                    setIsModalOpen(false);
                  }}
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
