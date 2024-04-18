import { exampleQuestions } from "@/prompt/problemGeneration";
import {
  GenerateQuestionResponseSchema,
  type GenerateQuestionResponse,
} from "@/types/problems";
import type { ConversationChain } from "langchain/chains";

// 질문 생성 함수
export async function generateQuestions({
  source,
  conversationChain: chain,
  isAssistantAdded,
}: {
  source: string;
  conversationChain: ConversationChain;
  isAssistantAdded?: boolean;
}) {
  let retryCount = 0;
  const maxRetryCount = 5;

  let generatedQuestions: GenerateQuestionResponse = {
    questions: [],
  };

  while (retryCount < maxRetryCount) {
    console.log("generatedQuestions :", generatedQuestions);

    // 대화 체인을 사용하여 질문 생성
    const result = await chain.call({
      source,
      generatedQuestions:
        generatedQuestions.questions.length === 0
          ? ""
          : JSON.stringify(generatedQuestions),
    });

    const resultResponse = isAssistantAdded
      ? "{" + result.response
      : result.response;

    let response: GenerateQuestionResponse | null = null;

    try {
      const parsed = JSON.parse(resultResponse);
      response = parsed;
    } catch (e) {
      console.error("error:", e);
    }

    if (
      response === null ||
      GenerateQuestionResponseSchema.safeParse(response).success === false
    ) {
      console.log("파싱 에러, 재시도 합니다.");
      retryCount++;
      continue;
    }

    const newQuestions = response.questions;
    console.log("newQuestions:", newQuestions);

    const uniqueQuestions = [
      ...generatedQuestions.questions,
      ...newQuestions.filter((newQuestion) => {
        const isUnique =
          !generatedQuestions.questions.some((prevQuestion) => {
            if (newQuestion.type === "obj" && prevQuestion.type === "obj") {
              return (
                prevQuestion.question === newQuestion.question ||
                prevQuestion.options?.toSorted().join() ===
                  newQuestion.options?.toSorted().join()
              );
            } else {
              return prevQuestion.question === newQuestion.question;
            }
          }) &&
          !exampleQuestions.some((exampleQuestion) => {
            if (newQuestion.type === "obj" && exampleQuestion.type === "obj") {
              return (
                exampleQuestion.question === newQuestion.question ||
                exampleQuestion.options?.toSorted().join() ===
                  newQuestion.options?.toSorted().join()
              );
            } else {
              return exampleQuestion.question === newQuestion.question;
            }
          });
        return isUnique;
      }),
    ];

    if (uniqueQuestions.length === generatedQuestions.questions.length) {
      console.log("새로운 질문이 없습니다. 재시도 합니다.");
      retryCount++;
      continue;
    }

    generatedQuestions.questions = uniqueQuestions;

    if (newQuestions.length === 0) {
      console.log("더 이상 생성할 질문이 없습니다.");
      break;
    }
  }

  return generatedQuestions;
}
