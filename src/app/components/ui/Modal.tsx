"use client";
import { Button } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import ModalConfirmButton from "./ModalConfirmButton";
import ModalCloseButton from "./ModalCloseButton";
import ModalAlertButton from "./ModalAlertButton";

type Props = {
  children: React.ReactNode;
  Header: React.ReactNode;
  className?: string;
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
  width?: string;
  height?: string;
  kind: "confirm" | "alert" | "prompt" | "close" | "none";
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function Modal({
  children,
  isModalOpen,
  setIsModalOpen,
  className,
  width,
  height,
  kind,
  Header,
  onConfirm,
  onCancel,
}: Props) {
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
  }, [setIsModalOpen]);

  let BelowButton: React.ReactNode = null;

  if (kind === "confirm") {
    BelowButton = (
      <ModalConfirmButton
        setIsModalOpen={setIsModalOpen}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );
  }
  if (kind === "close") {
    BelowButton = (
      <ModalCloseButton setIsModalOpen={setIsModalOpen} onCancel={onCancel} />
    );
  }
  if (kind === "alert") {
    BelowButton = (
      <ModalAlertButton setIsModalOpen={setIsModalOpen} onConfirm={onConfirm} />
    );
  }

  return (
    <>
      {isModalOpen &&
        createPortal(
          <div
            className={`fixed left-0 top-0 z-[999] flex h-full w-full justify-center bg-black bg-opacity-50 pt-[20vh]`}
          >
            <div
              ref={modalRef}
              className={twMerge(
                `flex h-fit w-fit flex-col items-center justify-center rounded-xl border border-gray-400 bg-neutral-100`,
                [width, height],
                className,
              )}
            >
              <div>{Header}</div>
              <div className="flex-1">{children}</div>
              {BelowButton && <div>{BelowButton}</div>}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
