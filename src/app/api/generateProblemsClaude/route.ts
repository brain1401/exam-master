import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import {
  objectiveProblemGenerationChatPromptWithJSON,
  subjectiveProblemGenerationChatPromptWithJSON,
  problemGenerationChatPromptWithJSON,
} from "@/prompt/problemGeneration";
import { generateQuestions } from "@/service/generate";
import { claudeOpus } from "@/const/bedrockClaudeModel";
import { CreateOption } from "@/types/problems";

const model = new BedrockChat({
  temperature: 0.2,
  region: "us-west-2",
  model: claudeOpus,
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

  let prompt;

  switch (createOption) {
    case "obj":
      prompt = objectiveProblemGenerationChatPromptWithJSON;
      break;
    case "sub":
      prompt = subjectiveProblemGenerationChatPromptWithJSON;
      break;
    default:
      prompt = problemGenerationChatPromptWithJSON;
  }

  const memory = new BufferMemory({
    inputKey: "source",
  });

  // 대화 체인 생성
  const chain = new ConversationChain({
    llm: model,
    prompt: prompt,
    memory: memory,
  });

  try {
    generateQuestions({
      source,
      conversationChain: chain,
      isAssistantAdded: true,
      userEmail: session.user.email,
    });

    return NextResponse.json({ success: "요청 생성됨" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
