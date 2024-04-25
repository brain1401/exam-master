import { Cohere } from "@langchain/cohere";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {
  objectiveProblemGenerationChatPrompt,
  subjectiveProblemGenerationChatPrompt,
  problemGenerationChatPrompt,
  defaultTotalQuestionsPrompt,
  subjectiveTotalQuestionsPrompt,
  multipleChoiceTotalQuestionsPrompt,
} from "@/prompt/problemGeneration";
import { generateQuestions } from "@/service/generate";
import { CreateOption } from "@/types/problems";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new Cohere({
  model: "command-r-plus",
  temperature: 0.3,
  apiKey: process.env.COHERE_API_KEY || "",
  maxTokens: 4000,
}).bind({
  presencePenalty: 0.8,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestBody = await req.json();

  const source: string | undefined = requestBody.source;

  const createOption = requestBody.createOption as CreateOption;

  if (!source) {
    return NextResponse.json(
      { error: "source가 비어있습니다." },
      { status: 400 },
    );
  }

  let problemGenerationPrompt;
  let totalQuestionsPrompt;

  switch (createOption) {
    case "obj":
      problemGenerationPrompt = objectiveProblemGenerationChatPrompt;
      totalQuestionsPrompt = multipleChoiceTotalQuestionsPrompt;
      break;
    case "sub":
      problemGenerationPrompt = subjectiveProblemGenerationChatPrompt;
      totalQuestionsPrompt = subjectiveTotalQuestionsPrompt;
      break;
    default:
      problemGenerationPrompt = problemGenerationChatPrompt;
      totalQuestionsPrompt = defaultTotalQuestionsPrompt;
  }

  const totalQuestionsChain = totalQuestionsPrompt.pipe(model);

  const problemGenerationChain = RunnableSequence.from([
    {
      topics: (input) => input.topics,
      source: (input) => input.source,
      generatedQuestions: (input) => input.generatedQuestions,
    },
    problemGenerationPrompt,
    model,
  ]);

  try {
    generateQuestions({
      source,
      totalQuestionsChain,
      problemGenerationChain,
      userEmail: session.user.email,
    });

    return NextResponse.json({ success: "요청 생성됨" }, { status: 200 });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
