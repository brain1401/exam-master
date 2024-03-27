import { Button } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomLoading from "./CustomLoading";

type Props = {
  setIsModalOpen: (isOpen: boolean) => void;
  UUID: string;
};

export default function ShareLinkWindow({ setIsModalOpen, UUID }: Props) {
  const [shareProblemSetUUID, setShareProblemSetUUID] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/createProblemSetShareLink`, {
          params: {
            uuid: UUID,
          },
        });

        const data = response.data;

        setShareProblemSetUUID(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [UUID]);

  if(loading) {
    return (
      <div className="flex h-[10rem] w-[20rem] flex-col justify-center items-center">
        <CustomLoading /> 
      </div>
    );
   
  }
  
  return (
    <div className="flex flex-col w-[20rem] h-[10rem] justify-center gap-y-5">
      <div>
        <input
          className="w-full rounded-md border border-gray-400 p-2"
          type="text"
          value={`${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareProblemSetUUID}`}
          readOnly
        />
      </div>
      <Button
        onClick={() => {
          navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareProblemSetUUID}`,
          );
          setIsModalOpen(false);
        }}
      >
        복사
      </Button>
    </div>
  );
}
