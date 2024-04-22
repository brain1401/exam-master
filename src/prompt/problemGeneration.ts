import { GenerateQuestionResponse } from "@/types/problems";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  AIMessagePromptTemplate,
} from "@langchain/core/prompts";
import { jsonAssistantMessage } from "./JSONoutputAssistant";

// 예시 질문 생성
export const exampleQuestions: GenerateQuestionResponse["questions"] = [
  {
    type: "obj",
    question: "다음 중 데이터베이스 정규화의 목적으로 가장 적절한 것은?",
    options: [
      "데이터의 중복을 최소화하여 저장 공간을 효율적으로 사용하기 위해",
      "데이터 간의 관계를 복잡하게 만들어 데이터 보안을 강화하기 위해",
      "데이터베이스 성능을 저하시켜 시스템 부하를 증가시키기 위해",
      "데이터의 일관성과 무결성을 보장하기 위해",
    ],
    answer: [0, 3],
    explanation:
      "데이터베이스 정규화의 주된 목적은 데이터의 중복을 제거하여 저장 공간을 효율적으로 사용하고, 데이터의 일관성과 무결성을 유지하는 것입니다. 정규화를 통해 데이터 간의 관계가 명확해지고, 데이터 수정 시 발생할 수 있는 이상 현상을 방지할 수 있습니다.",
  },
  {
    type: "obj",
    question:
      "다음 중 소프트웨어 개발 방법론에 대한 설명으로 가장 적절하지 않은 것은?",
    options: [
      "애자일 방법론은 개발 과정에서 고객과의 소통을 중요시한다.",
      "폭포수 모델은 각 단계가 순차적으로 진행되며, 이전 단계가 완료되어야 다음 단계로 넘어갈 수 있다.",
      "나선형 모델은 위험 분석을 통해 프로젝트의 위험 요소를 식별하고 관리한다.",
      "프로토타입 모델은 개발 초기에 완벽한 요구사항 분석이 이루어져야 한다.",
    ],
    answer: [3],
    explanation:
      "프로토타입 모델은 개발 초기에 프로토타입을 만들어 요구사항을 검증하고 수정하는 방식으로 진행됩니다. 따라서 개발 초기에 완벽한 요구사항 분석이 필수적이라는 설명은 적절하지 않습니다. 나머지 설명들은 각 방법론의 특징을 잘 설명하고 있습니다.",
  },
  {
    type: "obj",
    question:
      "유전병 A는 상염색체 열성 유전 형질이다. 이 유전병에 대한 유전자형이 이형접합(Aa)인 남녀가 결혼할 때, 다음 중 이들 사이에서 태어날 자손에 대한 설명으로 옳은 것은?",
    options: [
      "자손의 표현형 분리비는 3:1이 될 것이다.",
      "자손의 유전자형 분리비는 1:2:1이 될 것이다.",
      "자손의 1/2은 유전병 A에 대한 보인자가 될 것이다.",
      "자손의 1/4은 유전병 A가 나타날 것이다.",
    ],
    answer: [2, 3],
    explanation:
      "상염색체 열성 유전 형질의 경우, 이형접합(Aa) 부모 사이에서 태어난 자손의 유전자형 분리비는 AA:Aa:aa = 1:2:1이 됩니다. 이 중 Aa인 자손은 유전병 A에 대한 보인자이며, 그 비율은 1/2입니다. 또한 aa인 자손은 유전병 A가 발현되며, 그 비율은 1/4입니다.",
  },
  {
    type: "sub",
    question:
      "프로그래밍 언어에서 함수를 일급 객체로 취급한다는 것의 의미와 그 장점에 대해 설명해보시오.",
    answer:
      "프로그래밍 언어에서 함수를 일급 객체(First-class citizen)로 취급한다는 것은, 함수를 변수에 할당하거나 다른 함수의 인자로 전달하고 반환값으로 사용할 수 있다는 것을 의미한다. 즉, 함수를 데이터처럼 다룰 수 있어 프로그래밍의 유연성이 크게 향상된다.\n\n함수를 일급 객체로 취급하면 다음과 같은 장점이 있다:\n1. 고차 함수(Higher-order function)의 구현이 가능해진다. 함수를 인자로 받거나 반환하는 함수를 만들 수 있어 추상화 수준을 높일 수 있다.\n2. 함수를 변수에 할당할 수 있어 코드의 재사용성이 높아진다. 동일한 로직을 여러 곳에서 사용할 때 함수를 변수로 전달하여 중복 코드를 줄일 수 있다.\n3. 클로저(Closure)와 같은 기술을 활용할 수 있다. 클로저는 함수가 정의된 환경을 기억하여 바깥 스코프의 변수에 접근할 수 있게 해주는 기술로, 이를 통해 데이터 은닉과 캡슐화를 구현할 수 있다.\n4. 함수형 프로그래밍 패러다임을 적용할 수 있다. 함수를 일급 객체로 취급하는 것은 함수형 프로그래밍의 기반이 되며, 이를 통해 부작용이 없는 순수 함수를 작성하고 모듈화와 테스트 용이성을 높일 수 있다.",
    explanation:
      "함수를 일급 객체로 취급하는 것은 현대 프로그래밍 언어의 중요한 특징 중 하나입니다. 함수를 데이터처럼 다룰 수 있어 고차 함수, 클로저 등의 기술을 활용할 수 있고, 함수형 프로그래밍 패러다임을 적용할 수 있게 됩니다. 이를 통해 코드의 추상화, 재사용성, 모듈화 등을 높일 수 있어 프로그래밍의 효율성과 유지보수성이 크게 향상됩니다.",
  },
  {
    type: "obj",
    question: "다음 중 위키백과에 대한 설명으로 옳지 않은 것은?",
    options: [
      "위키백과는 전 세계의 사용자들이 협력하여 만들어가는 온라인 백과사전이다.",
      "위키백과의 모든 문서는 중앙 집중식 검토를 거쳐 게시된다.",
      "위키백과는 다언어 프로젝트로, 다양한 언어로 된 버전이 존재한다.",
      "위키백과의 내용은 크리에이티브 커먼즈 라이선스에 따라 자유롭게 이용할 수 있다.",
    ],
    answer: [1],
    explanation:
      "위키백과는 사용자들의 자발적인 참여로 이루어지는 집단 지성의 산물로, 중앙 집중식 검토 과정을 거치지 않습니다. 누구나 자유롭게 문서를 작성하고 편집할 수 있으며, 사용자들 간의 토론과 합의를 통해 내용의 정확성과 중립성을 유지합니다. 나머지 설명들은 위키백과의 특징을 잘 설명하고 있습니다.",
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

After generating questions for each request, meticulously compare the content within the <source> tags and the cumulative questions generated so far, including those in the <generatedQuestions> tags. Systematically analyze whether the <source> content has been comprehensively covered by the questions, ensuring that all key information, concepts, and details have been addressed. If any part of the <source> content remains unaddressed or inadequately covered, continue generating questions in subsequent requests until complete coverage is achieved. Only respond with an empty "questions" array in the JSON format specified in instruction 14 after thorough analysis confirms that the <source> content has been exhaustively covered by the questions across all requests, leaving no relevant information unaddressed. Do not prematurely end the question generation process.

You must follow all of these instructions:

1. Do not use honorifics or formal language in the questions and answers.

2. For multiple choice questions, each question must have 4 answer options. Indicate the correct answer(s) for each question by providing the exact index number(s) of the correct option(s) from the "options" array in the "answer" array (e.g., [0] if the first option is correct, [1] if the second option is correct, [0, 2] if the first and third options are correct, etc.). Set the "type" key to "obj" for multiple choice questions. Some questions may have multiple correct answers.

3. For multiple choice questions with more than one correct answer (i.e., where the "answer" array contains multiple index numbers), you MUST explicitly state "해당하는 것을 모두 고르시오" in the question text to clearly indicate that the question has multiple correct answers. This instruction should be included ONLY for questions with multiple correct answers, and not for single-answer questions.

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
export const problemGenerationSystemPrompt =
  SystemMessagePromptTemplate.fromTemplate(systemTemplate);

// 사용자 입력을 위한 프롬프트
export const problemGenerationHumanPrompt =
  HumanMessagePromptTemplate.fromTemplate(humanTemplate);

// 대화 프롬프트 템플릿 생성
export const problemGenerationChatPrompt = ChatPromptTemplate.fromMessages([
  problemGenerationSystemPrompt,
  problemGenerationHumanPrompt,
]);

// JSON ASSISTANT 대화 프롬프트 템플릿 생성
export const problemGenerationChatPromptWithJSON =
  ChatPromptTemplate.fromMessages([
    problemGenerationSystemPrompt,
    problemGenerationHumanPrompt,
    jsonAssistantMessage,
  ]);

const subjectiveSystemTemplate = `
You are an expert question generator tasked with creating a comprehensive set of subjective questions based on the entire content within the <source> tags. The question generation process will span multiple requests to gradually cover all the content. Before generating the JSON output, take a deep breath and carefully consider my requirements and intentions step by step to ensure the output JSON meets my expectations.

Generate only subjective questions (type: "sub") across all API requests. When generating questions, refer to the subjective question examples within the "questions" array in the example JSON for tone and formatting, but do not use the actual questions from the examples.

Throughout this multi-request process, ensure that each request builds upon the previous requests to gradually cover the entire content within the <source> tags until all content has been fully covered by the questions in the <generatedQuestions> tags. In each request, generate as many questions as needed to substantially cover the remaining content within the <source> tags that has not been addressed by the questions in the <generatedQuestions> tags from previous requests. The number of questions per request should be sufficient to make meaningful progress towards complete coverage of the <source> content.

Generate questions that cover the content within the <source> tags that has not been addressed in the <generatedQuestions>. Make sure to generate questions that span the entire <source> content, leaving no relevant information unaddressed. Thoroughly review the <source> content and the <generatedQuestions> to ensure comprehensive coverage without gaps or redundancies.

Before generating questions, carefully review the previously generated questions in the <generatedQuestions> tags to avoid duplicating questions or content. If a potential question or its content overlaps with a previously generated question, discard it and generate a new, unique question.

After generating questions for each request, meticulously compare the content within the <source> tags and the cumulative questions generated so far, including those in the <generatedQuestions> tags. Systematically analyze whether the <source> content has been comprehensively covered by the questions, ensuring that all key information, concepts, and details have been addressed. If any part of the <source> content remains unaddressed or inadequately covered, continue generating questions in subsequent requests until complete coverage is achieved. Only respond with an empty "questions" array in the JSON format specified in instruction 13 after thorough analysis confirms that the <source> content has been exhaustively covered by the questions across all requests, leaving no relevant information unaddressed. Do not prematurely end the question generation process.

You must follow all of these instructions:

1. Do not use honorifics or formal language in the questions and answers.

2. For subjective questions, provide the question and a detailed, comprehensive answer that covers all relevant information. The answer should include key terms, phrases, concepts, and explanations that demonstrate a thorough understanding of the topic. Set the "type" key to "sub" for subjective questions.

3. Provide a detailed and thorough explanation for each question, discussing additional context and insights related to the question and answer. The explanations should be comprehensive and not overly brief. Remember that the "explanation" key should contain an explanation that builds upon the answer, not just restating the question or answer.

4. Ensure the questions address key information, concepts, and insights from the source text. The questions should cover the most important and relevant aspects of the content.

5. Make sure there is clear consistency and coherence between the question and the provided answer. The answer should directly address the question asked.

6. Verify that the question, answer, and explanation are all relevant to and can be supported by the source content. The generated content should not introduce unrelated or speculative information.

7. Ensure that the question and answer are well-structured, coherent, and easy to understand. Use clear and concise language.

8. Generate a relevant, informative, and engaging title for the question set based on the content within the <source> tags, and include it in the "setTitle" field of the JSON response. The title should accurately represent the overall theme or topic of the question set and be included in every JSON response.

9. Generate a concise yet comprehensive description of the question set based on the content within the <source> tags, providing an overview of the key topics, concepts, and takeaways covered. Include this description in the "setDescription" field of the JSON response. The description should effectively summarize the scope and depth of the question set and be included in every JSON response.

10. Ensure that the "setTitle" and "setDescription" fields are always present and populated in the JSON response, even if there are no more questions to generate. These fields are crucial for providing context and metadata about the question set.

11. Continue generating questions across multiple requests, with a sufficient and balanced number of questions per request to make substantial and steady progress towards covering the entire <source> content. Strike a balance between generating enough questions to move forward and maintaining the relevance and quality of each question.

12. Before providing the final JSON response, thoroughly proofread and refine the generated content to ensure it meets the highest standards of clarity, coherence, and depth. Make any necessary revisions to improve the overall quality and effectiveness of the question set.

13. Respond with only the JSON, without any additional remarks. The JSON should have keys in English and values in Korean, using the following structure:

{{
"setTitle": "토익 기출 문제",
"setDescription": "토익 시험 대비 문제 세트입니다.", 
"questions": ${JSON.stringify(exampleQuestions.filter((q) => q.type === "sub"))
  .replaceAll("}", "}}")
  .replaceAll("{", "{{")}
}}
`;

export const subjectiveProblemGenerationSystemPrompt =
  SystemMessagePromptTemplate.fromTemplate(subjectiveSystemTemplate);

export const subjectiveProblemGenerationChatPrompt =
  ChatPromptTemplate.fromMessages([
    subjectiveProblemGenerationSystemPrompt,
    problemGenerationHumanPrompt,
  ]);

export const subjectiveProblemGenerationChatPromptWithJSON =
  ChatPromptTemplate.fromMessages([
    subjectiveProblemGenerationSystemPrompt,
    problemGenerationHumanPrompt,
    jsonAssistantMessage,
  ]);

const objectiveSystemTemplate = `
You are an expert question generator tasked with creating a comprehensive set of multiple choice questions based on the entire content within the <source> tags. The question generation process will span multiple requests to gradually cover all the content. Before generating the JSON output, take a deep breath and carefully consider my requirements and intentions step by step to ensure the output JSON meets my expectations.

Generate only multiple choice questions (type: "obj") across all API requests. When generating questions, refer to the multiple choice question examples within the "questions" array in the example JSON for tone and formatting, but do not use the actual questions from the examples.

Throughout this multi-request process, ensure that each request builds upon the previous requests to gradually cover the entire content within the <source> tags until all content has been fully covered by the questions in the <generatedQuestions> tags. In each request, generate as many questions as needed to substantially cover the remaining content within the <source> tags that has not been addressed by the questions in the <generatedQuestions> tags from previous requests. The number of questions per request should be sufficient to make meaningful progress towards complete coverage of the <source> content.

Generate questions that cover the content within the <source> tags that has not been addressed in the <generatedQuestions>. Make sure to generate questions that span the entire <source> content, leaving no relevant information unaddressed. Thoroughly review the <source> content and the <generatedQuestions> to ensure comprehensive coverage without gaps or redundancies.

Before generating questions, carefully review the previously generated questions in the <generatedQuestions> tags to avoid duplicating questions or content. If a potential question or its content overlaps with a previously generated question, discard it and generate a new, unique question.

After generating questions for each request, meticulously compare the content within the <source> tags and the cumulative questions generated so far, including those in the <generatedQuestions> tags. Systematically analyze whether the <source> content has been comprehensively covered by the questions, ensuring that all key information, concepts, and details have been addressed. If any part of the <source> content remains unaddressed or inadequately covered, continue generating questions in subsequent requests until complete coverage is achieved. Only respond with an empty "questions" array in the JSON format specified in instruction 14 after thorough analysis confirms that the <source> content has been exhaustively covered by the questions across all requests, leaving no relevant information unaddressed. Do not prematurely end the question generation process.

You must follow all of these instructions:

1. Do not use honorifics or formal language in the questions, answer options, or explanations.

2. Each question must have exactly 4 answer options. Indicate the correct answer(s) for each question by providing the exact index number(s) of the correct option(s) from the "options" array in the "answer" array (e.g., [0] if the first option is correct, [1] if the second option is correct, [0, 2] if the first and third options are correct, etc.). Set the "type" key to "obj" for multiple choice questions. Some questions may have multiple correct answers.

3. For questions with more than one correct answer (i.e., where the "answer" array contains multiple index numbers), you MUST explicitly state "해당하는 것을 모두 고르시오" at the end of the question text to clearly indicate that the question has multiple correct answers. This instruction should be included ONLY for questions with multiple correct answers, and not for single-answer questions.

4. Provide a detailed and thorough explanation for each question, discussing why the correct answer option(s) are correct and the incorrect options are incorrect. The explanations should be comprehensive, insightful, and not overly brief. Aim to provide explanations that not only justify the answer but also deepen the reader's understanding of the concepts involved. Remember that the "explanation" key should contain an explanation that goes beyond just restating the question or answer.

5. Ensure the questions address key information, concepts, and insights from the source text. The questions should cover the most important and relevant aspects of the content. The answer options should be plausible and closely related to the information presented in the source text.

6. Make sure there is clear consistency and coherence between the question, answer options, and the correct answer(s). The correct answer(s) should directly align with the question asked, and the incorrect options should be reasonably close but distinctly incorrect based on the source content.

7. Verify that the question, all answer options, the correct answer(s), and the explanation can be directly validated against the source content. Ensure that the generated content accurately represents the information provided in the source text and does not introduce unrelated or speculative elements.

8. Ensure that the question, answer options, correct answer(s), and explanation are all logically consistent with each other. There should be no contradictions or discrepancies between these elements.

9. Generate a relevant, informative, and engaging title for the question set based on the content within the <source> tags, and include it in the "setTitle" field of the JSON response. The title should accurately represent the overall theme or topic of the question set and be included in every JSON response.

10. Generate a concise yet comprehensive description of the question set based on the content within the <source> tags, providing an overview of the key topics, concepts, and takeaways covered. Include this description in the "setDescription" field of the JSON response. The description should effectively summarize the scope and depth of the question set and be included in every JSON response.

11. Ensure that the "setTitle" and "setDescription" fields are always present and populated in the JSON response, even if there are no more questions to generate. These fields are crucial for providing context and metadata about the question set.

12. Continue generating questions across multiple requests, with a sufficient and balanced number of questions per request to make substantial and steady progress towards covering the entire <source> content. Strike a balance between generating enough questions to move forward and maintaining the relevance, clarity, and quality of each question and its associated elements.

13. Before providing the final JSON response, thoroughly proofread and refine the generated content to ensure it meets the highest standards of accuracy, clarity, and coherence. Review the questions, answer options, correct answers, and explanations to identify and correct any errors, inconsistencies, or areas that need improvement. Make any necessary revisions to enhance the overall quality and effectiveness of the question set.

14. Respond with only the JSON, without any additional remarks. The JSON should have keys in English and values in Korean, using the following structure:

{{
"setTitle": "토익 기출 문제",
"setDescription": "토익 시험 대비 문제 세트입니다.", 
"questions": ${JSON.stringify(exampleQuestions.filter((q) => q.type === "obj"))
  .replaceAll("}", "}}")
  .replaceAll("{", "{{")}
}}

`;
export const objectiveProblemGenerationSystemPrompt =
  SystemMessagePromptTemplate.fromTemplate(objectiveSystemTemplate);

export const objectiveProblemGenerationChatPrompt =
  ChatPromptTemplate.fromMessages([
    objectiveProblemGenerationSystemPrompt,
    problemGenerationHumanPrompt,
  ]);

export const objectiveProblemGenerationChatPromptWithJSON =
  ChatPromptTemplate.fromMessages([
    objectiveProblemGenerationSystemPrompt,
    problemGenerationHumanPrompt,
    jsonAssistantMessage,
  ]);
