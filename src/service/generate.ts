import type { GenerateQuestionResponse } from "@/types/problems";
import type { LLMChain } from "langchain/chains";
import type { ConversationChain } from "langchain/chains";

// 질문 생성 함수
export async function generateQuestions({
  source,
  totalQuestionsChain,
  conversationChain: chain,
}: {
  source: string;
  totalQuestionsChain: LLMChain;
  conversationChain: ConversationChain;
}) {
  // 총 질문 수 결정
  const totalQuestionsResult = await totalQuestionsChain.call({ source });
  console.log("totalQuestionsResult :", totalQuestionsResult);

  const totalQuestions = JSON.parse(totalQuestionsResult.text).totalQuestions;
  console.log("totalQuestions :", totalQuestions);

  let retryCount = 0;

  let generatedQuestions: GenerateQuestionResponse = {
    totalQuestions: totalQuestions,
    questionCount: 0,
    questions: [],
  };

  let isFailed = false;

  while (generatedQuestions.questionCount < totalQuestions) {
    if (retryCount >= 5) {
      console.log("리트라이 횟수 초과");
      isFailed = true;
      break;
    }

    // 대화 체인을 사용하여 질문 생성
    const result = await chain.call({
      source,
      generatedQuestions:
        generatedQuestions.questions.length === 0
          ? ""
          : JSON.stringify(generatedQuestions),
    });

    let response: GenerateQuestionResponse | null = null;

    console.log("result.response :", result.response);

    try {
      const parsed = JSON.parse(result.response);
      response = parsed;
    } catch (e) {
      console.error("error :", e);
    }

    if (response === null) {
      console.log("파싱 에러, 재시도 합니다.");
      retryCount++;
      continue;
    }

    const newQuestions = response.questions;

    console.log("result :", result);
    console.log("newQuestions :", newQuestions);

    let foundDuplicate = false;

    const uniqueNewQuestions = newQuestions.filter((newQuestion) => {
      const isUnique = !generatedQuestions.questions.some((prevQuestion) => {
        if (newQuestion.type === "obj" && prevQuestion.type === "obj") {
          return (
            prevQuestion.question === newQuestion.question ||
            prevQuestion.options?.join() === newQuestion.options?.join()
          );
        } else {
          return prevQuestion.question === newQuestion.question;
        }
      });

      if (!isUnique) {
        foundDuplicate = true;
      }

      return isUnique;
    });

    if (foundDuplicate) {
      console.log("중복된 질문 발견 재시도 함.");
      retryCount++;
    }

    // 생성된 질문 추가
    generatedQuestions.questions = [
      ...generatedQuestions.questions,
      ...uniqueNewQuestions,
    ];

    generatedQuestions.questionCount += uniqueNewQuestions.length;

    // questionCount와 실제 질문 수 검증
    if (
      generatedQuestions.questionCount !== generatedQuestions.questions.length
    ) {
      generatedQuestions.questionCount = generatedQuestions.questions.length;
    }
    console.log(
      "generatedQuestions.questionsCount :",
      generatedQuestions.questionCount,
    );
    console.log("totalQuestions :", totalQuestions);
  }

  if (isFailed === true) {
    return null;
  }

  // 최종 결과에서 중복 질문 제거
  const uniqueQuestions = generatedQuestions.questions.filter(
    (question, index, self) =>
      index ===
      self.findIndex((q) => {
        if (question.type === "obj" && q.type === "obj") {
          return (
            q.question === question.question &&
            q.options?.join() === question.options?.join()
          );
        } else {
          return q.question === question.question;
        }
      }),
  );
  generatedQuestions.questions = uniqueQuestions;
  generatedQuestions.questionCount = uniqueQuestions.length;

  // 최종 결과 JSON 문자열로 반환
  return generatedQuestions;
}
