import { Button } from "@nextui-org/react";

type Props = {
  onConfirm?: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function ModalAlertButton({ onConfirm, setIsModalOpen }: Props) {
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
    </div>
  );
}
