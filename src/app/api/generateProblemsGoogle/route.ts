import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  defaultTotalQuestionsPromptWithJSON,
  multipleChoiceTotalQuestionsPromptWithJSON,
  objectiveProblemGenerationChatPromptWithJSON,
  problemGenerationChatPromptWithJSON,
  subjectiveProblemGenerationChatPromptWithJSON,
  subjectiveTotalQuestionsPromptWithJSON,
} from "@/prompt/problemGeneration";
import { generateQuestions } from "@/service/generate";
import { CreateOption } from "@/types/problems";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API,
  temperature: 0.2,
  model: "gemini-pro",
  maxOutputTokens: 4000,
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
      problemGenerationPrompt = objectiveProblemGenerationChatPromptWithJSON;
      totalQuestionsPrompt = multipleChoiceTotalQuestionsPromptWithJSON;
      break;
    case "sub":
      problemGenerationPrompt = subjectiveProblemGenerationChatPromptWithJSON;
      totalQuestionsPrompt = subjectiveTotalQuestionsPromptWithJSON;
      break;
    default:
      problemGenerationPrompt = problemGenerationChatPromptWithJSON;
      totalQuestionsPrompt = defaultTotalQuestionsPromptWithJSON;
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
    if (e instanceof Error) {
      console.error("error :", e);
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "에러가 발생했습니다." },
      { status: 400 },
    );
  }
}
