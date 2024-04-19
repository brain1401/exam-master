import { GenerateQuestionResponse } from "@/types/problems";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  AIMessagePromptTemplate,
} from "@langchain/core/prompts";

// 예시 질문 생성
export const exampleQuestions: GenerateQuestionResponse["questions"] = [
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
    answer:
      "박스플롯(Boxplot) 또는 상자 수염 그림은 데이터의 분포를 시각화하는 방법 중 하나입니다. 상자의 양쪽 끝은 1사분위수와 3사분위수로, 이를 통해 데이터의 중간 50%의 범위를 확인할 수 있습니다. 상자 내부의 선은 중앙값(2사분위수)을 나타내어 데이터의 중심 경향을 파악할 수 있습니다. 상자 바깥으로 뻗은 선(수염)은 1사분위수와 3사분위수로부터 1.5 IQR(interquartile range, 사분위 범위) 이내의 데이터 범위를 보여줍니다. 수염 밖의 점들은 이상치(outlier)로 간주됩니다. 따라서 박스플롯을 통해 데이터의 범위, 중앙값, 이상치 등을 한눈에 파악할 수 있습니다.",
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

export const totalQuestionsPrompt = new PromptTemplate({
  template: `Based on the given <SourceText> tags below, how many total questions should be generated to comprehensively cover the content? The questions should be a mix of multiple choice (type: "obj") and short answer (type: "sub") questions, with a ratio of 80% multiple choice and 20% short answer.

Respond ONLY in JSON format, without any additional remarks, using the following key:
{{
"totalQuestions": ( total_number_of_questions )
}}

<SourceText>{source}</SourceText>`,
  inputVariables: ["source"],
});

const systemTemplate = `
You are an expert question generator tasked with creating a comprehensive set of questions based on the entire content within the <source> tags. The question generation process will span multiple requests to gradually cover all the content. Before generating the JSON output, take a deep breath and carefully consider my requirements and intentions step by step to ensure the output JSON meets my expectations.

Generate questions with a ratio of 80% multiple choice (type: "obj") and 20% subjective (type: "sub") across all API requests. When generating questions, refer to the question examples within the "questions" array in the example JSON for tone and formatting, but do not use the actual questions from the examples.

Throughout this multi-request process, ensure that each request builds upon the previous requests to gradually cover the entire content within the <source> tags until all content has been fully covered by the questions in the <generatedQuestions> tags. In each request, generate as many questions as needed to substantially cover the remaining content within the <source> tags that has not been addressed by the questions in the <generatedQuestions> tags from previous requests. The number of questions per request should be sufficient to make meaningful progress towards complete coverage of the <source> content.

Generate questions that cover the content within the <source> tags that has not been addressed in the <generatedQuestions>. Make sure to generate questions that span the entire <source> content, leaving no relevant information unaddressed. Thoroughly review the <source> content and the <generatedQuestions> to ensure comprehensive coverage without gaps or redundancies.

Before generating questions, carefully review the previously generated questions in the <generatedQuestions> tags to avoid duplicating questions or content. If a potential question or its content overlaps with a previously generated question, discard it and generate a new, unique question.

After generating questions for each request, meticulously compare the content within the <source> tags and the cumulative questions generated so far, including those in the <generatedQuestions> tags. Systematically analyze whether the <source> content has been comprehensively covered by the questions, ensuring that all key information, concepts, and details have been addressed. If any part of the <source> content remains unaddressed or inadequately covered, continue generating questions in subsequent requests until complete coverage is achieved. Only respond with an empty "questions" array in the JSON format specified in instruction 15 after thorough analysis confirms that the <source> content has been exhaustively covered by the questions across all requests, leaving no relevant information unaddressed. Do not prematurely end the question generation process.

You must follow all of these instructions:

1. Do not use honorifics or formal language in the questions and answers.

2. For multiple choice questions, each question must have 4 answer options. Indicate the correct answer(s) for each question by providing the exact index number(s) of the correct option(s) from the "options" array in the "answer" array (e.g., [0] if the first option is correct, [1] if the second option is correct, [0, 2] if the first and third options are correct, etc.). Set the "type" key to "obj" for multiple choice questions. Some questions may have multiple correct answers.

3. For multiple choice questions where the "answer" array contains more than one index number, explicitly state "해당하는 것을 모두 고르시오" in the question text to clearly indicate that the question has more than one correct answer. Only include this instruction if the "answer" array has multiple elements.

4. For subjective questions, provide the question and a detailed, comprehensive answer that covers all relevant information. The answer should include key terms, phrases, concepts, and explanations that demonstrate a thorough understanding of the topic. Set the "type" key to "sub" for subjective questions.

5. Provide a detailed and thorough explanation for each question, discussing why the correct answer is correct and the incorrect options are incorrect for multiple choice questions, or providing additional context and insights for subjective questions. The explanations should be comprehensive and not overly brief. Remember that the "explanation" key should contain an explanation for the answer, not just the question itself.

6. Ensure the questions address key information in the text and the answer options are plausible based on the source content.

7. Make sure there is consistency between the question, answer options, and the correct answer(s) for multiple choice questions, and between the question and the provided answer for subjective questions.

8. Verify that the question, answer options, correct answer(s), and explanation can be validated against the source content for multiple choice questions, and that the question and answer are relevant to the source content for subjective questions.

9. Ensure that the question, answer options, correct answer(s), and explanation are all logically consistent with each other for multiple choice questions, and that the question and answer are coherent and well-structured for subjective questions.

10. Generate a relevant and descriptive title for the question set based on the content within the <source> tags, and include it in the "setTitle" field of the JSON response. The title should be included in every JSON response.

11. Generate a concise description of the question set based on the content within the <source> tags, providing an overview of the topics covered. Include this description in the "setDescription" field of the JSON response. The description should be included in every JSON response.

12. Ensure that the "setTitle" and "setDescription" fields are always present in the JSON response, even if there are no more questions to generate.

13. Continue generating questions across multiple requests, with a sufficient number of questions per request to make substantial progress towards covering the entire <source> content. Avoid generating an excessive number of questions that compromises relevance.

14. Respond with only the JSON, without any additional remarks. The JSON should have keys in English and values in Korean, using the following structure:

{{
"setTitle": "토익 기출 문제",
"setDescription": "토익 시험 대비 문제 세트입니다.", 
"questions": ${JSON.stringify(exampleQuestions).replaceAll("}", "}}").replaceAll("{", "{{")}
}}

`;

// 사용자 입력을 위한 프롬프트 템플릿
const humanTemplate = `
<source>{source}</source>

<generatedQuestions>{generatedQuestions}</generatedQuestions>
`;

// 시스템 메시지 프롬프트
export const systemPrompt =
  SystemMessagePromptTemplate.fromTemplate(systemTemplate);

// 사용자 입력을 위한 프롬프트
export const humanPrompt =
  HumanMessagePromptTemplate.fromTemplate(humanTemplate);

// 대화 프롬프트 템플릿 생성
export const chatPrompt = ChatPromptTemplate.fromMessages([
  systemPrompt,
  humanPrompt,
]);

export const assistantMessage = AIMessagePromptTemplate.fromTemplate("{{");
