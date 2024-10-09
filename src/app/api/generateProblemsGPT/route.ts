import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import {
  defaultTotalQuestionsPrompt,
  multipleChoiceTotalQuestionsPrompt,
  objectiveProblemGenerationChatPrompt,
  problemGenerationChatPrompt,
  subjectiveProblemGenerationChatPrompt,
  subjectiveTotalQuestionsPrompt,
} from "@/prompt/problemGeneration";
import { generateQuestions } from "@/service/generate";
import { CreateOption } from "@/types/problems";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_AI_KEY,
  temperature: 0.4,
  maxTokens: 4000,
  model: "gpt-4o",
  presencePenalty: 2,
}).bind({
  response_format: {
    type: "json_object",
  },
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestBody = await req.json();

  const source: string = requestBody.source;

  const createOption = requestBody.createOption as CreateOption;

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

  // 대화 체인 생성
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
      userEmail: session.user?.email,
    });

    return NextResponse.json({ success: "요청 생성됨" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "문제 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
