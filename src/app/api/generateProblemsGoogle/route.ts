import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { chatPrompt } from "@/prompt/problemGeneration";
import { generateQuestions } from "@/service/generate";

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

  const memory = new BufferMemory({
    inputKey: "source",
  });

  // 대화 체인 생성
  const chain = new ConversationChain({
    llm: model,
    prompt: chatPrompt,
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
