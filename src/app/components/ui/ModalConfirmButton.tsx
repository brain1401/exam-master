import { Button } from "@nextui-org/react";

type Props = {
  onConfirm?: () => void;
  onCancel?: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function ModalConfirmButton({
  onConfirm,
  onCancel,
  setIsModalOpen,
}: Props) {
  return (
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
  );
}
