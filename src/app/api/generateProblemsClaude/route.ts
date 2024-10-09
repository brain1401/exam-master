import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import {
  objectiveProblemGenerationChatPromptWithJSON,
  subjectiveProblemGenerationChatPromptWithJSON,
  problemGenerationChatPromptWithJSON,
  defaultTotalQuestionsPromptWithJSON,
  subjectiveTotalQuestionsPromptWithJSON,
  multipleChoiceTotalQuestionsPromptWithJSON,
} from "@/prompt/problemGeneration";
import { generateQuestions } from "@/service/generate";
import { claudeSonnet } from "@/const/bedrockClaudeModel";
import { CreateOption } from "@/types/problems";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new BedrockChat({
  temperature: 0.1,
  region: "ap-northeast-2",
  model: claudeSonnet,
  maxTokens: 4000,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
  },
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
      isAssistantAdded: true,
      userEmail: session.user.email,
    });

    return NextResponse.json({ success: "요청 생성됨" }, { status: 200 });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
