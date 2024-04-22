import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { problemGenerationChatPrompt } from "@/prompt/problemGeneration";
import { generateQuestions } from "@/service/generate";

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
