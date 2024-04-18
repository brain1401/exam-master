import {
  GenerateQuestionResponse,
  GenerateQuestionResponseSchema,
  ProblemReplacedImageKey,
} from "@/types/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import { postProblems } from "@/service/problems";
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
    const parsedJson: GenerateQuestionResponse | null = await generateQuestions(
      {
        source,
        conversationChain: chain,
      },
    );

    if (parsedJson === null) {
      return NextResponse.json(
        {
          error: "문제를 생성하는데 실패했습니다..",
        },
        {
          status: 400,
        },
      );
    }

    console.log(parsedJson);

    if (GenerateQuestionResponseSchema.safeParse(parsedJson).success === true) {
      await postProblems({
        isPublic: false,
        problemSetName: "AI로 생성된 문제",
        toBePostedProblems: parsedJson.questions.map<
          NonNullable<ProblemReplacedImageKey>
        >((question) => ({
          type: question.type as "obj" | "sub",
          question: question.question,
          candidates:
            question.options?.map((option, i) => {
              if (Array.isArray(question.answer)) {
                return {
                  id: i,
                  text: option,
                  isAnswer: question.answer.every(
                    (answer) => typeof answer === "number",
                  )
                    ? question.answer.includes(i)
                    : false,
                };
              }
              return { id: null, text: "", isAnswer: false };
            }) || null,
          image: null,
          subAnswer:
            typeof question.answer === "string" ? question.answer : null,
          isAnswerMultiple: question.answer.length > 1,
          additionalView: "",
          isAdditionalViewButtonClicked: false,
          isImageButtonClicked: false,
        })),
        timeLimit: 0,
        description: "AI로 생성된 문제입니다.",
        userEmail: session.user?.email,
      });
    } else {
      return NextResponse.json(
        { error: "파싱에 실패했습니다." },
        { status: 400 },
      );
    }

    return NextResponse.json(parsedJson, { status: 200 });
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