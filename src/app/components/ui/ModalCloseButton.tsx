import { Button } from "@nextui-org/react";

type Props = {
  onCancel?: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function ModalCloseButton({
  onCancel,
  setIsModalOpen,
}: Props) {
  return (
    <div className="flex w-full">
      <Button
      className="w-full"
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