import { exampleQuestions } from "@/prompt/problemGeneration";
import {
  GenerateQuestionResponseSchema,
  ProblemReplacedImageKey,
  TotalQuestions,
  totalQuestionsSchema,
  type GenerateQuestionResponse,
} from "@/types/problems";
import type { ConversationChain } from "langchain/chains";
import { postProblems } from "./problems";
import type { Runnable, RunnableConfig } from "@langchain/core/runnables";
import type { BaseMessageChunk } from "@langchain/core/messages";
import { noticeToPhone } from "./notice";
import partialParse from "@/utils/parse";

// 질문 생성 함수
export async function generateQuestions({
  source,
  conversationChain,
  totalQuestionsChain,
  isAssistantAdded,
  userEmail,
}: {
  source: string;
  conversationChain: ConversationChain;
  totalQuestionsChain: Runnable<
    {
      source: any;
    },
    BaseMessageChunk,
    RunnableConfig
  >;
  isAssistantAdded?: boolean;
  userEmail: string;
}) {

  let retryCount = 0;
  const maxRetryCount = 3;

  let totalQuestionsRetryCount = 0;
  const maxTotalQuestionsRetryCount = 3;

  let i = 0;

  let generatedQuestions: GenerateQuestionResponse = {
    setTitle: "",
    setDescription: "",
    questions: [],
  };

  await noticeToPhone({
    title: "문제 생성 시작",
    body: `사용자 이메일:${userEmail}\n문제 생성 시작`,
  });

  // 함수 시작 시간 기록
  const startTime = Date.now();

  // 함수 로깅
  const checkExecutionTime = async () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    if (elapsedTime > 10 * 60 * 1000) {
      console.log("함수 실행 시간이 10분을 초과했습니다.");
      // 추가 작업 수행 (예: 경고 알림, 로깅 등)

      try {
        await noticeToPhone({
          title: "문제 생성 시간 초과",
          body: `사용자 이메일:${userEmail}\n문제 생성 시간 초과\n총 ${generatedQuestions.questions.length} 문제 생성됨`,
        });
      } catch (error) {
        console.error("알림 전송 중 에러 발생:", error);
      }
    }
  };

  const checkInterval = setInterval(checkExecutionTime, 60 * 1000); // 1분마다 확인

  let totalQuestions: TotalQuestions | null = null;

  try {
    while (totalQuestionsRetryCount < maxTotalQuestionsRetryCount) {
      try {
        const totalQuestionsResult = await totalQuestionsChain.invoke({
          source,
        });

        const totalQuestionsRawString =
          (isAssistantAdded ? "{" : "") + totalQuestionsResult.content;

        console.log("totalQuestionsRawString :", totalQuestionsRawString);

        try {
          const parsed = partialParse(totalQuestionsRawString);

          if (totalQuestionsSchema.safeParse(parsed).success === true) {
            totalQuestions = parsed;
            break;
          } else {
            console.log("totalQuestions 파싱 에러, 재시도 합니다.");
            totalQuestionsRetryCount++;
            continue;
          }
        } catch (e) {
          console.error("error:", e);
          console.log("totalQuestions 파싱 에러, 재시도 합니다.");
          totalQuestionsRetryCount++;
          continue;
        }
      } catch (e) {
        console.error("error:", e);
        console.log("totalQuestions 파싱 에러, 재시도 합니다.");
        totalQuestionsRetryCount++;
        continue;
      }
    }

    console.log(totalQuestions?.topics);

    if (!totalQuestions?.topics) {
      throw new Error("주제가 없습니다.");
    }

    while (retryCount < maxRetryCount) {
      try {
        console.log(`${i}번째 시도 :`);

        // 대화 체인을 사용하여 질문 생성
        const result = await conversationChain.call({
          source,
          generatedQuestions:
            generatedQuestions.questions.length === 0
              ? ""
              : JSON.stringify(generatedQuestions.questions),
          topics: JSON.stringify(totalQuestions?.topics) || "",
        });

        const resultResponse = isAssistantAdded
          ? "{" + result.response
          : result.response;

        let response: GenerateQuestionResponse | null = null;

        console.log("resultResponse :", resultResponse);
        try {
          const parsed: GenerateQuestionResponse = partialParse(resultResponse);
          parsed.questions.filter((question) => question !== null);
          response = parsed;

          console.log("parsed:", JSON.stringify(parsed));
        } catch (e) {
          console.error("error:", e);
        }

        if (
          response === null ||
          GenerateQuestionResponseSchema.safeParse(response).success === false
        ) {
          console.log("파싱 에러, 재시도 합니다.");
          retryCount++;
          i++;
          continue;
        }

        if (i === 0) {
          generatedQuestions.setTitle = response.setTitle;
          generatedQuestions.setDescription = response.setDescription;
        }

        const newQuestions = response.questions;
        console.log("newQuestions:", newQuestions);

        if (newQuestions.length === 0) {
          console.log("더 이상 생성할 질문이 없습니다.");
          break;
        }

        const uniqueQuestions = [
          ...generatedQuestions.questions,
          ...newQuestions.filter((newQuestion) => {
            const isUnique =
              !generatedQuestions.questions.some((prevQuestion) => {
                if (newQuestion.type === "obj" && prevQuestion.type === "obj") {
                  return (
                    prevQuestion.question === newQuestion.question ||
                    (prevQuestion.options &&
                      newQuestion.options &&
                      prevQuestion.options.length ===
                        newQuestion.options.length &&
                      prevQuestion.options.every((option, index) =>
                        newQuestion.options?.includes(option),
                      ))
                  );
                } else if (
                  newQuestion.type === "sub" &&
                  prevQuestion.type === "sub"
                ) {
                  return (
                    prevQuestion.question === newQuestion.question ||
                    prevQuestion.answer === newQuestion.answer
                  );
                }
              }) &&
              !exampleQuestions.some((exampleQuestion) => {
                if (
                  newQuestion.type === "obj" &&
                  exampleQuestion.type === "obj"
                ) {
                  return (
                    exampleQuestion.question === newQuestion.question ||
                    (exampleQuestion.options &&
                      newQuestion.options &&
                      exampleQuestion.options.length ===
                        newQuestion.options.length &&
                      exampleQuestion.options.every((option, index) =>
                        newQuestion.options?.includes(option),
                      ))
                  );
                } else {
                  return exampleQuestion.question === newQuestion.question;
                }
              }) &&
              !(newQuestion.type === "obj" && newQuestion.answer.length === 0);

            return isUnique;
          }),
        ];

        if (uniqueQuestions.length === generatedQuestions.questions.length) {
          console.log("새로운 질문이 없습니다. 재시도 합니다.");
          retryCount++;
          continue;
        }

        generatedQuestions.questions = uniqueQuestions;
        i++;
      } catch (e) {
        console.error("error:", e);
        retryCount++;
        i++;
        continue;
      }
    }

    if (generatedQuestions.questions.length !== 0) {
      await postProblems({
        isPublic: false,
        problemSetName: generatedQuestions.setTitle,
        toBePostedProblems: generatedQuestions.questions.map<
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
        description: generatedQuestions.setDescription,
        userEmail: userEmail,
      });

      await noticeToPhone({
        title: "문제 생성됨",
        body: `사용자 이메일:${userEmail}\n문제 ${generatedQuestions.setTitle} 생성됨\n총 ${generatedQuestions.questions.length} 문제 생성됨`,
      });
    }
  } catch (e) {
    console.error("error:", e);

    if (generatedQuestions.questions.length !== 0) {
      console.log("에러 발생으로 인해 지금까지 생성된 문제를 저장합니다.");

      await postProblems({
        isPublic: false,
        problemSetName: generatedQuestions.setTitle,
        toBePostedProblems: generatedQuestions.questions.map<
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
        description: generatedQuestions.setDescription,
        userEmail: userEmail,
      });
    }

    await noticeToPhone({
      title: "문제 생성 중 에러 발생",
      body: `사용자 이메일:${userEmail}\n문제 ${generatedQuestions.setTitle} 생성 중 에러 발생\n총 ${generatedQuestions.questions.length} 문제 생성됨`,
    });
  } finally {
    clearInterval(checkInterval);
  }
}
