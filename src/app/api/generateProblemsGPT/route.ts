import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
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

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_AI_KEY,
  temperature: 0.4,
  maxTokens: 4000,
  modelName: "gpt-4-turbo",
  model: "gpt-4-turbo",
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

  const memory = new BufferMemory({
    inputKey: "source",
  });

  // 대화 체인 생성
  const chain = new ConversationChain({
    llm: model,
    prompt: problemGenerationChatPrompt,
    memory,
  });

  try {
    generateQuestions({
      source,
      totalQuestionsChain,
      conversationChain: chain,
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
