import { exampleQuestions } from "@/prompt/problemGeneration";
import {
  GenerateQuestionResponseSchema,
  ProblemReplacedImageKey,
  TotalQuestions,
  totalQuestionsSchema,
  GenerateQuestionResponse,
  Question,
} from "@/types/problems";
import { postProblems } from "./problems";
import { Runnable } from "@langchain/core/runnables";
import { noticeToPhone } from "./notice";
import partialParse from "@/utils/parse";
import { RunnableSequence } from "@langchain/core/runnables";
import { AIMessage } from "@langchain/core/messages";

// 질문이 고유한지 확인하는 유틸리티 함수
function isQuestionUnique(
  newQuestion: Question,
  existingQuestions: Question[],
): boolean {
  return !existingQuestions.some((prevQuestion) => {
    if (newQuestion.type === "obj" && prevQuestion.type === "obj") {
      return (
        prevQuestion.question === newQuestion.question ||
        (prevQuestion.options &&
          newQuestion.options &&
          prevQuestion.options.length === newQuestion.options.length &&
          prevQuestion.options.every((option) =>
            newQuestion.options!.includes(option),
          ))
      );
    } else if (newQuestion.type === "sub" && prevQuestion.type === "sub") {
      return (
        prevQuestion.question === newQuestion.question ||
        prevQuestion.answer === newQuestion.answer
      );
    }
    return false;
  });
}

// 질문을 postProblems에 필요한 형식으로 변환하는 유틸리티 함수
function mapQuestionsToProblems(
  questions: Question[],
): NonNullable<ProblemReplacedImageKey>[] {
  return questions.map<NonNullable<ProblemReplacedImageKey>>((question) => ({
    type: question.type as "obj" | "sub",
    question: question.question,
    candidates:
      question.options?.map((option, i) => ({
        id: i,
        text: option,
        isAnswer:
          Array.isArray(question.answer) &&
          question.answer.every((answer) => typeof answer === "number")
            ? question.answer.includes(i)
            : false,
      })) || null,
    image: null,
    subAnswer: typeof question.answer === "string" ? question.answer : null,
    isAnswerMultiple: Array.isArray(question.answer)
      ? question.answer.length > 1
      : false,
    additionalView: "",
    isAdditionalViewButtonClicked: false,
    isImageButtonClicked: false,
  }));
}

// 질문을 생성하는 메인 함수
export async function generateQuestions({
  source,
  problemGenerationChain,
  totalQuestionsChain,
  isAssistantAdded = false,
  userEmail,
  existingMode = false,
}: {
  source: string;
  problemGenerationChain: RunnableSequence;
  totalQuestionsChain?: Runnable<any>;
  isAssistantAdded?: boolean;
  userEmail: string;
  existingMode?: boolean;
}) {
  let retryCount = 0;
  const maxRetryCount = 3;

  let totalQuestionsRetryCount = 0;
  const maxTotalQuestionsRetryCount = 3;

  let iteration = 0;

  let generatedQuestions: GenerateQuestionResponse = {
    setTitle: "",
    setDescription: "",
    questions: [],
  };

  // 질문 생성 시작 알림을 보냄
  await noticeToPhone({
    title: "문제 생성 시작",
    body: `사용자 이메일:${userEmail}\n문제 생성 시작`,
  });

  // 함수 실행 시간을 기록하여 모니터링
  const startTime = Date.now();

  // 실행 시간이 10분을 초과하는지 확인하고 초과 시 알림
  const checkExecutionTime = async () => {
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime > 10 * 60 * 1000) {
      console.log("함수 실행 시간이 10분을 초과했습니다.");
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

  // 1분마다 실행 시간을 확인
  const checkInterval = setInterval(checkExecutionTime, 60 * 1000);

  let totalQuestions: TotalQuestions | null = null;

  try {
    // totalQuestionsChain이 있는 경우 주제(topic) 정보를 가져옴
    if (totalQuestionsChain) {
      while (totalQuestionsRetryCount < maxTotalQuestionsRetryCount) {
        try {
          const totalQuestionsResult = await totalQuestionsChain.invoke({
            source,
          });

          const totalQuestionsRawString = isAssistantAdded
            ? "{" + totalQuestionsResult.content
            : (totalQuestionsResult as string);

          const parsed = partialParse(totalQuestionsRawString);

          if (totalQuestionsSchema.safeParse(parsed).success) {
            totalQuestions = parsed;
            break;
          } else {
            console.log("totalQuestions 파싱 오류, 재시도 중...");
            totalQuestionsRetryCount++;
          }
        } catch (error) {
          console.error("오류:", error);
          console.log("totalQuestions 파싱 오류, 재시도 중...");
          totalQuestionsRetryCount++;
        }
      }

      if (!totalQuestions?.topics) {
        throw new Error("주제가 없습니다.");
      }
    }

    // 질문 생성 루프
    while (retryCount < maxRetryCount) {
      try {
        console.log(`시도 ${iteration}:`);

        const result = await problemGenerationChain.invoke({
          ...(existingMode ? { input: source } : { source }),
          generatedQuestions:
            generatedQuestions.questions.length === 0
              ? ""
              : JSON.stringify(generatedQuestions.questions),
          topics: JSON.stringify(totalQuestions?.topics) || "",
        });

        const content = (result as AIMessage).content as string;

        const contentResponse = isAssistantAdded ? "{" + content : content;

        let response: GenerateQuestionResponse | null = null;

        try {
          response = partialParse(contentResponse);
          if (response) {
            response.questions = response.questions.filter(
              (question) => question !== null,
            );
          }
        } catch (error) {
          console.error("응답 파싱 중 오류:", error);
        }

        if (
          response === null ||
          !GenerateQuestionResponseSchema.safeParse(response).success
        ) {
          console.log("파싱 오류, 재시도 중...");
          retryCount++;
          iteration++;
          continue;
        }

        // 첫 번째 반복에서 제목과 설명을 설정
        if (iteration === 0) {
          generatedQuestions.setTitle = response.setTitle;
          generatedQuestions.setDescription = response.setDescription;
        }

        const newQuestions = response.questions as Question[];

        if (newQuestions.length === 0) {
          console.log("더 이상 생성할 질문이 없습니다.");
          break;
        }

        // 중복 및 유효하지 않은 질문 필터링
        const uniqueQuestions = [
          ...generatedQuestions.questions,
          ...newQuestions.filter((newQuestion) => {
            const isUnique =
              isQuestionUnique(
                newQuestion,
                generatedQuestions.questions as Question[],
              ) &&
              isQuestionUnique(newQuestion, exampleQuestions as Question[]) &&
              !(newQuestion.type === "obj" && newQuestion.answer.length === 0);

            return isUnique;
          }),
        ];

        if (uniqueQuestions.length === generatedQuestions.questions.length) {
          console.log("새로운 고유 질문이 없습니다. 재시도 중...");
          retryCount++;
          continue;
        }

        generatedQuestions.questions = uniqueQuestions;
        iteration++;
      } catch (error) {
        console.error("오류 발생:", error);
        retryCount++;
        iteration++;
        continue;
      }
    }

    // 생성된 문제가 있는 경우 저장
    if (generatedQuestions.questions.length !== 0) {
      await postProblems({
        isPublic: false,
        problemSetName: generatedQuestions.setTitle,
        toBePostedProblems: mapQuestionsToProblems(
          generatedQuestions.questions as Question[],
        ),
        timeLimit: 0,
        description: generatedQuestions.setDescription,
        userEmail,
      });

      await noticeToPhone({
        title: "문제 생성됨",
        body: `사용자 이메일:${userEmail}\n문제 ${generatedQuestions.setTitle} 생성됨\n총 ${generatedQuestions.questions.length} 문제 생성됨`,
      });
    }
  } catch (error) {
    console.error("오류 발생:", error);

    // 에러 발생 시 생성된 문제를 저장
    if (generatedQuestions.questions.length !== 0) {
      console.log("에러 발생으로 인해 생성된 문제를 저장합니다.");

      await postProblems({
        isPublic: false,
        problemSetName: generatedQuestions.setTitle,
        toBePostedProblems: mapQuestionsToProblems(
          generatedQuestions.questions as Question[],
        ),
        timeLimit: 0,
        description: generatedQuestions.setDescription,
        userEmail,
      });
    }

    await noticeToPhone({
      title: "문제 생성 중 에러 발생",
      body: `사용자 이메일:${userEmail}\n문제 ${generatedQuestions.setTitle} 생성 중 에러 ${error} 발생\n총 ${generatedQuestions.questions.length} 문제 생성됨`,
    });
  } finally {
    // 실행 시간 확인 인터벌 해제
    clearInterval(checkInterval);
  }
}
