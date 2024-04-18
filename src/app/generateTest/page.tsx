import TestGeneration from "@/components/generation/TestGeneration";
import ProtectPage from "@/components/protection/ProtectPage";

export default function TestPage() {
  return (
    <>
      <ProtectPage>
        <TestGeneration />
      </ProtectPage>
    </>
  );
}
