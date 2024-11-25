import GeneratePageContent from "@/components/generation/GeneratePageContent";
import LoginRequired from "@/components/ui/LoginRequired";
import { getServerSession } from "next-auth";
import { canUserGenerateProblemSet } from "@/service/user";
import { redirect } from "next/navigation";

export default async function GeneratePage() {
  const session = await getServerSession();

  const email = session?.user?.email;

  if (!session || !email) {
    return <LoginRequired />;
  }

  const canGenerate = await canUserGenerateProblemSet(email);

  console.log(canGenerate);

  if (!canGenerate) {
    redirect("/generate/limit-reached");
  }

  return <GeneratePageContent />;
}
