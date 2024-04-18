import {
  GenerateQuestionResponse,
  GenerateQuestionResponseSchema,
  ProblemReplacedImageKey,
} from "@/types/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
} from "@langchain/core/prompts";
import { postProblems } from "@/service/problems";
import { BufferMemory } from "langchain/memory";
import {
  assistantMessage,
  humanPrompt,
  systemPrompt,
} from "@/prompt/problemGeneration";
import { generateQuestions } from "@/service/generate";

const model = new BedrockChat({
  temperature: 0.4,
  region: "us-west-2",
  model: "anthropic.claude-3-sonnet-20240229-v1:0",
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

  const source: string = requestBody.source;

  // 대화 프롬프트 템플릿 생성
  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemPrompt,
    humanPrompt,
    assistantMessage,
  ]);

  const memory = new BufferMemory({
    inputKey: "source",
  });

  // 대화 체인 생성
  const chain = new ConversationChain({
    llm: model,
    prompt: chatPrompt,
    memory: memory,
  });

  try {
    const parsedJson: GenerateQuestionResponse | null = await generateQuestions(
      {
        source,
        conversationChain: chain,
        isAssistantAdded: true,
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
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
