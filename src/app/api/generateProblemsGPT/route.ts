import {
  GenerateQuestionResponse,
  GenerateQuestionResponseSchema,
  ProblemReplacedImageKey,
} from "@/types/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { postProblems } from "@/service/problems";

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_AI_KEY,
  temperature: 0.4,
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

  const source = requestBody.source;

  const totalQuestionsPrompt = new PromptTemplate({
    template: `Based on the given source text below, how many total questions should be generated to comprehensively cover the content? The questions should be a mix of multiple choice (type: "obj") and short answer (type: "sub") questions, with a ratio of 80% multiple choice and 20% short answer.

Answer in JSON format with the following key:
\`\`\`json
{{
"totalQuestions": <total_number_of_questions>
}}
\`\`\`

Source Text: {source}`,
    inputVariables: ["source"],
  });
  // 총 질문 수를 결정하는 LLMChain
  const totalQuestionsChain = new LLMChain({
    llm: model,
    prompt: totalQuestionsPrompt,
  });

  // 예시 질문 생성
  const exampleQuestions = [
    {
      type: "obj",
      question: "데이터베이스에서 릴레이션에 대한 설명으로 틀린 것은?",
      options: [
        "모든 튜플은 서로 다른 값을 가지고 있다.",
        "하나의 릴레이션에서 튜플은 특정한 순서를 가진다.",
        "각 속성은 릴레이션 내에서 유일한 이름을 가진다.",
        "모든 속성 값은 원자 값(atomic value)을 가진다.",
      ],
      answer: [1],
      explanation:
        "릴레이션에서 튜플은 기본적으로 순서가 없으며, 튜플의 순서는 쿼리 결과에 영향을 주지 않습니다. 나머지 설명들은 릴레이션의 특성을 잘 설명하고 있습니다.",
    },
    {
      type: "obj",
      question:
        "취약점 관리를 위한 응용 프로그램의 보안 설정과 가장 거리가 먼 것은?",
      options: [
        "서버 관리실 출입 통제",
        "실행 프로세스 권한 설정",
        "운영체제의 접근 제한",
        "운영체제의 정보 수집 제한",
      ],
      answer: [0],
      explanation:
        "서버 관리실 출입 통제는 물리적 보안에 해당하며, 응용 프로그램의 보안 설정과는 직접적인 연관이 없습니다. 나머지 선택지들은 모두 응용 프로그램의 보안 설정과 관련이 있는 내용입니다.",
    },
    {
      type: "obj",
      question:
        "무각적색(PPRR)과 유각백색(pprr)인 Shorthorn종 육우를 교배하여 생산한 F1(PpRr)의 표현형이 무각조모색으로 나타났다. 멘델이 세웠던 가설 중 어느 것에 모순되는가?",
      options: [
        "특정 형질의 발현을 조절하는 유전인자는 한 쌍으로 되어 있다.",
        "한 쌍의 유전인자는 양친으로부터 하나씩 물려받은 것이다.",
        "생식 세포가 만들어질 때 유전인자들은 분리된 단위로서, 각 배우자에게 독립적으로 분배된다.",
        "한 쌍의 유전인자가 서로 다를 때 한 인자가 다른 인자를 억제시키고 그 인자만이 발현된다.",
      ],
      answer: [3],
      explanation:
        "무각과 적색이 모두 발현된 것으로 보아, 이 경우에는 한 인자가 다른 인자를 완전히 억제하지 않고 두 인자가 함께 발현되었음을 알 수 있습니다. 따라서 멘델의 우성의 법칙에 모순됩니다.",
    },
    {
      type: "sub",
      question:
        "많은 데이터를 그림을 이용하여 집합의 범위와 중앙값을 빠르게 확인할 수 있으며, 또한 통계적으로 이상 값이 있는지 빠르게 확인이 가능한 시각화 기법은 무엇인가?",
      answer: ["박스플롯", "boxplot"],
      explanation:
        "박스플롯(Boxplot)은 데이터의 분포를 간단하게 표현할 수 있는 시각화 방법입니다. 박스의 양쪽 끝은 1사분위수와 3사분위수를 나타내어 데이터의 범위를 확인할 수 있고, 박스 안의 선은 중앙값을 나타냅니다. 또한 박스 바깥의 점들을 통해 이상치를 쉽게 발견할 수 있습니다.",
    },
    {
      type: "obj",
      question:
        "다음 중 나무위키 게시판에서 볼 수 있는 게시판으로 옳은 것을 모두 고르시오. (단, 정답은 한 개일 수도 있다.)",
      options: ["공지사항", "그루터기", "신고 게시판", "정답 없음"],
      answer: [0, 1],
      explanation:
        "나무위키에는 공지사항 게시판과 그루터기 게시판이 있습니다. 공지사항 게시판은 운영진의 공지를 올리는 곳이고, 그루터기 게시판은 편집증명 신청, 문서 삭제 신청 등 위키 운영과 관련된 토론이 이루어지는 공간입니다. 하지만 신고 게시판은 나무위키에 존재하지 않습니다.",
    },
  ];

  // 시스템 메시지 프롬프트 템플릿
  const systemTemplate = `
Your task is to generate a comprehensive question set based on the entire content within the <source> tags. Generate questions with a ratio of 80% multiple choice (type: "obj") and 20% short answer (type: "sub") across all API requests. When generating questions, refer to the question examples within the <exampleQuestions> tags for tone and formatting.

Throughout this process, ensure that each request focuses on a specific portion of the source content and builds upon the previous requests to gradually cover the entire content. Avoid duplicating questions or content across requests.

You must follow all of these instructions:

1. For multiple choice questions, each question must have 4 answer options. Indicate the correct answer(s) for each question using the index number(s) of the correct option(s) in the "options" array (e.g., 0 for the first option, 1 for the second option, etc.). Set the "type" key to "obj" for multiple choice questions. Some questions may have multiple correct answers.

2. For short answer questions, provide the question and all acceptable correct answers. The correct answer(s) should be a single word or a combination of up to two words to facilitate easy grading through string comparison. Include all acceptable words or combinations of words that would be considered correct in the "answer" array. Set the "type" key to "sub" for short answer questions.

3. Before generating new questions, carefully review the previously generated questions in the <generatedQuestions> tags to avoid duplicating questions or content. If a potential question or its content overlaps with a previously generated question, discard it and generate a new, unique question.

4. Provide a detailed and thorough explanation for each question, discussing why the correct answer is correct and the incorrect options are incorrect. The explanations should be comprehensive and not overly brief.

5. Ensure the questions address key information in the text and the answer options are plausible based on the source content.

6. Make sure there is consistency between the question, answer options, and the correct answer(s).

7. Verify that the question, answer options, and correct answer(s) can be validated against the source content.

8. Ensure that the question, answer options, correct answer(s), and explanation are all logically consistent with each other.

9. After generating the questions, verify that they comprehensively cover the designated portion of the <source> content without any significant omissions. If any key information has been missed, generate additional questions to address those gaps.

10. Respond with only the JSON, without any additional remarks. The JSON should have keys in English and values in Korean, using the following structure:



\`\`\`json
{{
"totalQuestions": <totalQuestions>,
"questionCount": (현재 요청에서 생성된 문제 수(중복 제거 후)),
"questions": ${JSON.stringify(exampleQuestions).replaceAll("}", "}}").replaceAll("{", "{{")}
}}
\`\`\`

After generating the questions, double-check that the number of questions in the "questions" array matches the value of "questionCount". If there is a mismatch, adjust the "questionCount" value or remove/add questions as needed to ensure consistency.

If there is no more content left to generate questions from and the <generatedQuestions> tags are not empty, respond with an empty "questions" array and set "questionCount" to 0.
`;

  // 시스템 메시지 프롬프트
  const systemPrompt = SystemMessagePromptTemplate.fromTemplate(systemTemplate);

  // 사용자 입력을 위한 프롬프트 템플릿
  const humanTemplate = `
<source>{source}</source>

<generatedQuestions>{generatedQuestions}</generatedQuestions>
`;

  // 사용자 입력을 위한 프롬프트
  const humanPrompt = HumanMessagePromptTemplate.fromTemplate(humanTemplate);

  // 대화 프롬프트 템플릿 생성
  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemPrompt,
    humanPrompt,
  ]);

  // 대화 메모리 생성
  const memory = new BufferMemory({
    inputKey: "source",
  });

  // 대화 체인 생성
  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    prompt: chatPrompt,
  });

  // 질문 생성 함수
  async function generateQuestions(source: string, prevQuestions: any[] = []) {
    // 총 질문 수 결정
    const totalQuestionsResult = await totalQuestionsChain.call({ source });
    console.log("totalQuestionsResult :", totalQuestionsResult);

    const totalQuestions = JSON.parse(totalQuestionsResult.text).totalQuestions;
    console.log("totalQuestions :", totalQuestions);

    let generatedQuestions = {
      totalQuestions: totalQuestions,
      questionCount: prevQuestions.length,
      questions: prevQuestions,
    };

    while (generatedQuestions.questionCount < totalQuestions) {
      // 대화 체인을 사용하여 질문 생성
      const result = await chain.call({
        source,
        generatedQuestions:
          generatedQuestions.questions.length === 0
            ? ""
            : JSON.stringify(generatedQuestions),
      });
      const response: GenerateQuestionResponse = JSON.parse(result.response);
      const newQuestions = response.questions;

      console.log("result :", result);
      console.log("newQuestions :", newQuestions);

      const uniqueNewQuestions = newQuestions.filter(
        (newQuestion) =>
          !generatedQuestions.questions.some((prevQuestion) => {
            if (newQuestion.type === "obj" && prevQuestion.type === "obj") {
              return (
                prevQuestion.question === newQuestion.question ||
                prevQuestion.options.join() === newQuestion.options?.join()
              );
            } else {
              return prevQuestion.question === newQuestion.question;
            }
          }),
      );

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

    // 최종 결과에서 중복 질문 제거
    const uniqueQuestions = generatedQuestions.questions.filter(
      (question, index, self) =>
        index ===
        self.findIndex((q) => {
          if (question.type === "obj" && q.type === "obj") {
            return (
              q.question === question.question &&
              q.options.join() === question.options.join()
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

  const parsedJson: GenerateQuestionResponse = await generateQuestions(source);

  console.log(parsedJson);

  await postProblems({
    isPublic: false,
    problemSetName: "test",
    toBePostedProblems: parsedJson.questions.map<
      NonNullable<ProblemReplacedImageKey>
    >((question) => ({
      type: question.type as "obj" | "sub",
      question: question.question,
      candidates:
        question.options?.map((option, i) => ({
          id: i,
          text: option,
          isAnswer: question.answer.every(
            (answer) => typeof answer === "number",
          )
            ? question.answer.includes(i)
            : false,
        })) ?? [],
      image: null,
      subAnswer: question.answer.every((answer) => typeof answer === "string")
        ? question.answer.join()
        : null,
      isAnswerMultiple: question.answer.length > 1,
      additionalView: "",
      isAdditionalViewButtonClicked: false,
      isImageButtonClicked: false,
    })),
    timeLimit: 0,
    description: "test",
    userEmail: session.user?.email,
  });

  if (GenerateQuestionResponseSchema.safeParse(parsedJson).success === false) {
    return NextResponse.json({ error: "파싱에 실패했습니다.", status: 400 });
  }

  return NextResponse.json(
    parsedJson ?? { error: "파싱에 실패했습니다.", status: 400 },
  );
}
