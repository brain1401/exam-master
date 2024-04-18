"use server";

import {
  GenerateQuestionResponse,
  GenerateQuestionResponseSchema,
  ProblemReplacedImageKey,
} from "@/types/problems";
import { getServerSession } from "next-auth";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ConversationChain } from "langchain/chains";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { postProblems } from "@/service/problems";
import { BufferMemory } from "langchain/memory";
import {
  assistantMessage,
  humanPrompt,
  systemPrompt,
} from "@/prompt/problemGeneration";
import { generateQuestions } from "@/service/generate";

const sonnet = "anthropic.claude-3-sonnet-20240229-v1:0";
const opus = "anthropic.claude-3-opus-20240229-v1:0";

const model = new BedrockChat({
  temperature: 0.4,
  region: "us-west-2",
  model: opus,
  maxTokens: 4000,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
  },
});

export async function requestGeneratedProblemSet({ source }: { source: string }) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return { error: "Unauthorized" };
  }

  if (!source) {
    return { error: "source가 비어있습니다." };
  }
  
  generateProblemSet({ source });

  return { success: true };
}

async function generateProblemSet({ source }: { source: string }) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return { error: "Unauthorized" };
  }

  if (!source) {
    return { error: "source가 비어있습니다." };
  }

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
      return { error: "문제를 생성하는데 실패했습니다.." };
    }

    console.log(parsedJson);

    if (GenerateQuestionResponseSchema.safeParse(parsedJson).success === true) {
      await postProblems({
        isPublic: false,
        problemSetName: parsedJson.setTitle,
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
        description: parsedJson.setDescription,
        userEmail: session.user.email,
      });
    } else {
      return { error: "파싱에 실패했습니다." };
    }

    console.log("parsedJson:", parsedJson);

  } catch (e) {
    console.error(e);
    return { error: "Internal Server Error" };
  }
}
