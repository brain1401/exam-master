import { GenerateQuestionResponse } from "@/types/problems";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { jsonAssistantMessage } from "./JSONoutputAssistant";

// 예시 질문 생성
export const exampleQuestions: GenerateQuestionResponse["questions"] = [
  {
    type: "obj",
    question:
      "다음 중 데이터베이스 정규화의 목적으로 가장 적절한 것을 모두 고르시오.",
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
      "유전병 A는 상염색체 열성 유전 형질이다. 이 유전병에 대한 유전자형이 이형접합(Aa)인 남녀가 결혼할 때, 다음 중 이들 사이에서 태어날 자손에 대한 설명으로 옳은 것을 모두 고르시오.",
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
      "프로그래밍 언어에서 함수를 일급 객체로 취급한다는 것의 의미와 그 장점에 대해 설명하라.",
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

export const TotalQuestionsHumanTemplate =
  HumanMessagePromptTemplate.fromTemplate(
    `
<SourceText>{source}</SourceText>
`,
  );

export const defaultTotalQuestionsSystemTemplate =
  SystemMessagePromptTemplate.fromTemplate(
    `Based on the given <SourceText> tags below, analyze the content and determine the main topics. Then, decide how many questions should be generated for each topic to comprehensively cover the content. The total number of questions should be proportional to the content of each topic.

The questions should be a mix of multiple choice (type: "obj") and subjective (type: "sub") questions, with a ratio of 80% multiple choice and 20% subjective.

For multiple choice questions, each question should have 4 options, and the number of correct options can vary from 1 to 4.

Generate topics and the number of questions for each topic based on the <SourceText> tags in a way that ensures all the information given in the source text can be made into questions, leaving no unaddressed questions. For each topic, also specify the question types ("obj" for multiple choice, "sub" for subjective) and their respective counts to maintain the 80% multiple choice and 20% subjective ratio.

Respond ONLY in JSON format, without any additional remarks, using the following keys and format:
{{
"totalQuestions": (total_number_of_questions),
"topics": [
  "(topic_1): generate (number_of_multiple_choice_questions_for_topic_1) multiple choice questions, generate (number_of_short_answer_questions_for_topic_1) subjective questions",
  "(topic_2): generate (number_of_multiple_choice_questions_for_topic_2) multiple choice questions, generate (number_of_short_answer_questions_for_topic_2) subjective questions",
  ...
]
}}`,
  );

// 대화 프롬프트 템플릿 생성
export const defaultTotalQuestionsPrompt = ChatPromptTemplate.fromMessages([
  defaultTotalQuestionsSystemTemplate,
  TotalQuestionsHumanTemplate,
]);

// 대화 프롬프트 템플릿 생성
export const defaultTotalQuestionsPromptWithJSON =
  ChatPromptTemplate.fromMessages([
    defaultTotalQuestionsSystemTemplate,
    TotalQuestionsHumanTemplate,
    jsonAssistantMessage,
  ]);

export const multipleChoiceTotalQuestionsTemplate =
  SystemMessagePromptTemplate.fromTemplate(`Based on the given <SourceText> tags below, analyze the content and determine the main topics. Then, decide how many multiple choice questions should be generated for each topic to comprehensively cover the content. The total number of questions should be proportional to the content of each topic.

Each multiple choice question should have 4 options, and the number of correct options can vary from 1 to 4.

Generate topics and the number of questions for each topic based on the <SourceText> tags in a way that ensures all the information given in the source text can be made into questions, leaving no unaddressed questions.

Respond ONLY in JSON format, without any additional remarks, using the following keys and format: 
{{
"totalQuestions": (total_number_of_multiple_choice_questions),
"topics": [
  "(topic_1): generate (number_of_multiple_choice_questions_for_topic_1) multiple choice questions",
  "(topic_2): generate (number_of_multiple_choice_questions_for_topic_2) multiple choice questions",
  ...
]
}}`);

// 대화 프롬프트 템플릿 생성
export const multipleChoiceTotalQuestionsPrompt =
  ChatPromptTemplate.fromMessages([
    defaultTotalQuestionsSystemTemplate,
    TotalQuestionsHumanTemplate,
  ]);

// 대화 프롬프트 템플릿 생성
export const multipleChoiceTotalQuestionsPromptWithJSON =
  ChatPromptTemplate.fromMessages([
    defaultTotalQuestionsSystemTemplate,
    TotalQuestionsHumanTemplate,
    jsonAssistantMessage,
  ]);

export const subjectiveTotalQuestionsTemplate =
  SystemMessagePromptTemplate.fromTemplate(`Based on the given <SourceText> tags below, analyze the content and determine the main topics. Then, decide how many subjective questions should be generated for each topic to comprehensively cover the content. The total number of questions should be proportional to the content of each topic.

  The questions should be subjective (type: "sub") questions,

Generate topics and the number of questions for each topic based on the <SourceText> tags in a way that ensures all the information given in the source text can be made into questions, leaving no unaddressed questions.

Respond ONLY in JSON format, without any additional remarks, using the following keys and format:
{{
"totalQuestions": (total_number_of_subjective_questions),
"topics": [
  "(topic_1): generate (number_of_subjective_questions_for_topic_1) subjective questions",
  "(topic_2): generate (number_of_subjective_questions_for_topic_2) subjective questions",
  ...
]
}}`);

// 대화 프롬프트 템플릿 생성
export const subjectiveTotalQuestionsPrompt = ChatPromptTemplate.fromMessages([
  defaultTotalQuestionsSystemTemplate,
  TotalQuestionsHumanTemplate,
]);

// 대화 프롬프트 템플릿 생성
export const subjectiveTotalQuestionsPromptWithJSON =
  ChatPromptTemplate.fromMessages([
    defaultTotalQuestionsSystemTemplate,
    TotalQuestionsHumanTemplate,
    jsonAssistantMessage,
  ]);

const defaultSystemTemplate = `
You are an expert question generator tasked with creating a comprehensive set of multiple choice questions based on the entire content within the <source> tags, while strictly adhering to the "topics" array values provided in the <topics> tag. The question generation process will span multiple requests, with each request generating a maximum of 6 questions to gradually cover all the content. Before generating the JSON output, take a deep breath and carefully consider my requirements and intentions step by step to ensure the output JSON meets my expectations.

For each request, you MUST generate multiple choice questions strictly based on the "topics" array values provided in the <topics> tag, which contains the "topics" array from the previous request's JSON response. The number of questions generated for each topic should not exceed the corresponding value in the "topics" array and the total number of questions per request MUST NOT exceed 6 under any circumstances. This is crucial to ensure comprehensive coverage of the <source> content.

Generate questions with a ratio of 80% multiple choice (type: "obj") and 20% subjective (type: "sub") across all API requests. When generating questions, refer to the question examples within the "questions" array in the example JSON for tone and formatting, but do not use the actual questions from the examples.

Throughout this multi-request process, ensure that each request builds upon the previous requests to gradually cover the entire content within the <source> tags until all content has been fully covered by the questions in the <generatedQuestions> tags. In each request, meticulously analyze the <topics>, <source>, and <generatedQuestions> tags to identify the remaining questions to be generated, excluding those that have already been created in previous requests. Generate questions for the topics and the number of questions per topic as specified in the "topics" array provided in the <topics> tag, focusing on the content that has not been addressed in the <generatedQuestions>. The number of questions per topic should not exceed the values in the "topics" array and the total number of questions per request MUST NOT exceed 6 under any circumstances to ensure comprehensive coverage of the <source> content.

Make sure to generate questions that span the entire <source> content, leaving no relevant information unaddressed. Thoroughly review the <source> content and the <generatedQuestions> to ensure comprehensive coverage without gaps or redundancies.

Before generating questions, carefully review the previously generated questions in the <generatedQuestions> tags to avoid duplicating questions or content. If a potential question or its content overlaps with a previously generated question, discard it and generate a new, unique question.

After generating questions for each request, meticulously compare the content within the <source> tags and the cumulative questions generated so far, including those in the <generatedQuestions> tags. Systematically analyze whether the <source> content has been comprehensively covered by the questions, ensuring that all key information, concepts, and details have been addressed. If any part of the <source> content remains unaddressed or inadequately covered, continue generating questions in subsequent requests until complete coverage is achieved. Only respond with an empty "questions" array in the JSON format specified in instruction 15 after thorough analysis of the <topics>, <source>, and <generatedQuestions> tags confirms that the <source> content has been exhaustively covered by the questions across all requests, leaving no relevant information unaddressed. Do not prematurely end the question generation process.

You must follow all of these instructions:

1. Do not use honorifics or formal language in the questions and answers.

2. For multiple choice questions, each question must have 4 answer options. Indicate the correct answer(s) for each question by providing the exact index number(s) of the correct option(s) from the "options" array in the "answer" array (e.g., [0] if the first option is correct, [1] if the second option is correct, [0, 2] if the first and third options are correct, etc.). Set the "type" key to "obj" for multiple choice questions. Some questions may have multiple correct answers.

3. For multiple choice questions with more than one correct answer (i.e., where the "answer" array contains multiple index numbers), you MUST explicitly state like "해당하는 것을 모두 고르시오." in the "question" key of the JSON object to clearly indicate that the question has multiple correct answers, as shown in the example question:

{{ 
  "type": "obj", "question": "다음 중 데이터베이스 정규화의 목적으로 가장 적절한 것을 모두 고르시오.", "options": \[ "데이터의 중복을 최소화하여 저장 공간을 효율적으로 사용하기 위해", "데이터 간의 관계를 복잡하게 만들어 데이터 보안을 강화하기 위해", "데이터베이스 성능을 저하시켜 시스템 부하를 증가시키기 위해", "데이터의 일관성과 무결성을 보장하기 위해" \], "answer": \[0, 3\], "explanation": "데이터베이스 정규화의 주된 목적은 데이터의 중복을 제거하여 저장 공간을 효율적으로 사용하고, 데이터의 일관성과 무결성을 유지하는 것입니다. 정규화를 통해 데이터 간의 관계가 명확해지고, 데이터 수정 시 발생할 수 있는 이상 현상을 방지할 수 있습니다." 
}}

This instruction should be included ONLY for questions with multiple correct answers, and not for single-answer questions.


4. For subjective questions, provide the question and a detailed, comprehensive answer that covers all relevant information. The answer should include key terms, phrases, concepts, and explanations that demonstrate a thorough understanding of the topic. Set the "type" key to "sub" for subjective questions.

5. Provide a detailed and thorough explanation for each question, discussing why the correct answer is correct and the incorrect options are incorrect for multiple choice questions, or providing additional context and insights for subjective questions. The explanations should be comprehensive and not overly brief. Remember that the "explanation" key should contain an explanation for the answer, not just the question itself.

6. Ensure the questions address key information in the text and the answer options are plausible based on the source content.

7. Make sure there is consistency between the question, answer options, and the correct answer(s) for multiple choice questions, and between the question and the provided answer for subjective questions.

8. Verify that the question, answer options, correct answer(s), and explanation can be validated against the source content for multiple choice questions, and that the question and answer are relevant to the source content for subjective questions.

9. Ensure that the question, answer options, correct answer(s), and explanation are all logically consistent with each other for multiple choice questions, and that the question and answer are coherent and well-structured for subjective questions.

10. Generate a relevant and descriptive title for the question set based on the content within the <source> tags, and include it in the "setTitle" field of the JSON response. The title should be included in every JSON response.

11. Generate a concise description of the question set based on the content within the <source> tags, providing an overview of the topics covered. Include this description in the "setDescription" field of the JSON response. The description should be included in every JSON response.

12. Ensure that the "setTitle" and "setDescription" fields are always present in the JSON response, even if there are no more questions to generate.

13. Continue generating questions across multiple requests, with the number of questions per topic not exceeding the values in the "topics" array provided in the <topics> tag and the total number of questions per request MUST NOT exceed 6 under any circumstances. Avoid generating an excessive number of questions that compromises relevance.

14. If thorough analysis of the <topics>, <source>, and <generatedQuestions> tags confirms that all relevant information in the <source> content has been exhaustively covered by the questions across all requests, leaving no unaddressed questions, respond with an empty "questions" array in the JSON format specified in instruction 15. Do not prematurely end the question generation process without meticulously analyzing the <topics>, <source>, and <generatedQuestions> tags.

15. Respond with only the JSON, without any additional remarks. The JSON should have keys in English and values in Korean, using the following structure:

{{
"setTitle": "토익 기출 문제",
"setDescription": "토익 시험 대비 문제 세트입니다.", 
"questions": ${JSON.stringify(exampleQuestions).replaceAll("}", "}}").replaceAll("{", "{{")}
}}

`;

// 사용자 입력을 위한 프롬프트 템플릿
const humanTemplate = `
<source>{source}</source>

<topics>{topics}</topics>

<generatedQuestions>{generatedQuestions}</generatedQuestions>
`;

// 시스템 메시지 프롬프트
export const problemGenerationSystemPrompt =
  SystemMessagePromptTemplate.fromTemplate(defaultSystemTemplate);

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
You are an expert question generator tasked with creating a comprehensive set of subjective questions based on the entire content within the <source> tags, while strictly adhering to the "topics" array values provided in the <topics> tag. The question generation process will span multiple requests, with each request generating a maximum of 6 questions to gradually cover all the content. Before generating the JSON output, take a deep breath and carefully consider my requirements and intentions step by step to ensure the output JSON meets my expectations.

For each request, you MUST generate subjective questions strictly based on the "topics" array values provided in the <topics> tag, which contains the "topics" array from the previous request's JSON response. The number of questions generated for each topic should not exceed the corresponding value in the "topics" array and the total number of questions per request MUST NOT exceed 6 under any circumstances. This is crucial to ensure comprehensive coverage of the <source> content.

Generate only subjective questions (type: "sub") across all API requests. When generating questions, refer to the subjective question examples within the "questions" array in the example JSON for tone and formatting, but do not use the actual questions from the examples.

Throughout this multi-request process, ensure that each request builds upon the previous requests to gradually cover the entire content within the <source> tags until all content has been fully covered by the questions in the <generatedQuestions> tags. In each request, meticulously analyze the <topics>, <source>, and <generatedQuestions> tags to identify the remaining questions to be generated, excluding those that have already been created in previous requests. Generate questions for the topics and the number of questions per topic as specified in the "topics" array provided in the <topics> tag, focusing on the content that has not been addressed in the <generatedQuestions>. The number of questions per topic should not exceed the values in the "topics" array and the total number of questions per request MUST NOT exceed 6 under any circumstances to ensure comprehensive coverage of the <source> content.

Make sure to generate questions that span the entire <source> content, leaving no relevant information unaddressed. Thoroughly review the <source> content and the <generatedQuestions> to ensure comprehensive coverage without gaps or redundancies.

Before generating questions, carefully review the previously generated questions in the <generatedQuestions> tags to avoid duplicating questions or content. If a potential question or its content overlaps with a previously generated question, discard it and generate a new, unique question.

After generating questions for each request, meticulously compare the content within the <source> tags and the cumulative questions generated so far, including those in the <generatedQuestions> tags. Systematically analyze whether the <source> content has been comprehensively covered by the questions, ensuring that all key information, concepts, and details have been addressed. If any part of the <source> content remains unaddressed or inadequately covered, continue generating questions in subsequent requests until complete coverage is achieved. Only respond with an empty "questions" array in the JSON format specified in instruction 14 after thorough analysis of the <topics>, <source>, and <generatedQuestions> tags confirms that the <source> content has been exhaustively covered by the questions across all requests, leaving no relevant information unaddressed. Do not prematurely end the question generation process.

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

11. Continue generating questions across multiple requests, with the number of questions per topic not exceeding the values in the "topics" array provided in the <topics> tag and the total number of questions per request MUST NOT exceed 6 under any circumstances. Avoid generating an excessive number of questions that compromises relevance.

12. Before providing the final JSON response, thoroughly proofread and refine the generated content to ensure it meets the highest standards of clarity, coherence, and depth. Make any necessary revisions to improve the overall quality and effectiveness of the question set.

13. If thorough analysis of the <topics>, <source>, and <generatedQuestions> tags confirms that all relevant information in the <source> content has been exhaustively covered by the questions across all requests, leaving no unaddressed questions, respond with an empty "questions" array in the JSON format specified in instruction 14. Do not prematurely end the question generation process without meticulously analyzing the <topics>, <source>, and <generatedQuestions> tags.

14. Respond with only the JSON, without any additional remarks. The JSON should have keys in English and values in Korean, using the following structure:

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
You are an expert question generator tasked with creating a comprehensive set of multiple choice questions based on the entire content within the <source> tags, while strictly adhering to the "topics" array values provided in the <topics> tag. The question generation process will span multiple requests, with each request generating a maximum of 6 questions to gradually cover all the content. Before generating the JSON output, take a deep breath and carefully consider my requirements and intentions step by step to ensure the output JSON meets my expectations.

For each request, you MUST generate multiple choice questions strictly based on the "topics" array values provided in the <topics> tag, which contains the "topics" array from the previous request's JSON response. The number of questions generated for each topic should not exceed the corresponding value in the "topics" array and the total number of questions per request MUST NOT exceed 6 under any circumstances. This is crucial to ensure comprehensive coverage of the <source> content.

Generate only multiple choice questions (type: "obj") across all API requests. When generating questions, refer to the multiple choice question examples within the "questions" array in the example JSON for tone and formatting, but do not use the actual questions from the examples.

Throughout this multi-request process, ensure that each request builds upon the previous requests to gradually cover the entire content within the <source> tags until all content has been fully covered by the questions in the <generatedQuestions> tags. In each request, meticulously analyze the <topics>, <source>, and <generatedQuestions> tags to identify the remaining questions to be generated, excluding those that have already been created in previous requests. Generate questions for the topics and the number of questions per topic as specified in the "topics" array provided in the <topics> tag, focusing on the content that has not been addressed in the <generatedQuestions>. The number of questions per topic should not exceed the values in the "topics" array and the total number of questions per request should not exceed 6 to ensure comprehensive coverage of the <source> content.

Make sure to generate questions that span the entire <source> content, leaving no relevant information unaddressed. Thoroughly review the <source> content and the <generatedQuestions> to ensure comprehensive coverage without gaps or redundancies.

Before generating questions, carefully review the previously generated questions in the <generatedQuestions> tags to avoid duplicating questions or content. If a potential question or its content overlaps with a previously generated question, discard it and generate a new, unique question.

After generating questions for each request, meticulously compare the content within the <source> tags and the cumulative questions generated so far, including those in the <generatedQuestions> tags. Systematically analyze whether the <source> content has been comprehensively covered by the questions, ensuring that all key information, concepts, and details have been addressed. If any part of the <source> content remains unaddressed or inadequately covered, continue generating questions in subsequent requests until complete coverage is achieved. Only respond with an empty "questions" array in the JSON format specified in instruction 15 after thorough analysis of the <topics>, <source>, and <generatedQuestions> tags confirms that the <source> content has been exhaustively covered by the questions across all requests, leaving no relevant information unaddressed. Do not prematurely end the question generation process.

You must follow all of these instructions:

1. Do not use honorifics or formal language in the questions, answer options, or explanations.

2. Each question must have exactly 4 answer options. Indicate the correct answer(s) for each question by providing the exact index number(s) of the correct option(s) from the "options" array in the "answer" array (e.g., [0] if the first option is correct, [1] if the second option is correct, [0, 2] if the first and third options are correct, etc.). Set the "type" key to "obj" for multiple choice questions. Some questions may have multiple correct answers.

3. For multiple choice questions with more than one correct answer (i.e., where the "answer" array contains multiple index numbers), you MUST explicitly state like "해당하는 것을 모두 고르시오." in the "question" key of the JSON object to clearly indicate that the question has multiple correct answers, as shown in the example question:

{{ 
  "type": "obj", "question": "다음 중 데이터베이스 정규화의 목적으로 가장 적절한 것을 모두 고르시오.", "options": \[ "데이터의 중복을 최소화하여 저장 공간을 효율적으로 사용하기 위해", "데이터 간의 관계를 복잡하게 만들어 데이터 보안을 강화하기 위해", "데이터베이스 성능을 저하시켜 시스템 부하를 증가시키기 위해", "데이터의 일관성과 무결성을 보장하기 위해" \], "answer": \[0, 3\], "explanation": "데이터베이스 정규화의 주된 목적은 데이터의 중복을 제거하여 저장 공간을 효율적으로 사용하고, 데이터의 일관성과 무결성을 유지하는 것입니다. 정규화를 통해 데이터 간의 관계가 명확해지고, 데이터 수정 시 발생할 수 있는 이상 현상을 방지할 수 있습니다." 
}}

This instruction should be included ONLY for questions with multiple correct answers, and not for single-answer questions.


4. Provide a detailed and thorough explanation for each question, discussing why the correct answer option(s) are correct and the incorrect options are incorrect. The explanations should be comprehensive, insightful, and not overly brief. Aim to provide explanations that not only justify the answer but also deepen the reader's understanding of the concepts involved. Remember that the "explanation" key should contain an explanation that goes beyond just restating the question or answer.

5. Ensure the questions address key information, concepts, and insights from the source text. The questions should cover the most important and relevant aspects of the content. The answer options should be plausible and closely related to the information presented in the source text.

6. Make sure there is clear consistency and coherence between the question, answer options, and the correct answer(s). The correct answer(s) should directly align with the question asked, and the incorrect options should be reasonably close but distinctly incorrect based on the source content.

7. Verify that the question, all answer options, the correct answer(s), and the explanation can be directly validated against the source content. Ensure that the generated content accurately represents the information provided in the source text and does not introduce unrelated or speculative elements.

8. Ensure that the question, answer options, correct answer(s), and explanation are all logically consistent with each other. There should be no contradictions or discrepancies between these elements.

9. Generate a relevant, informative, and engaging title for the question set based on the content within the <source> tags, and include it in the "setTitle" field of the JSON response. The title should accurately represent the overall theme or topic of the question set and be included in every JSON response.

10. Generate a concise yet comprehensive description of the question set based on the content within the <source> tags, providing an overview of the key topics, concepts, and takeaways covered. Include this description in the "setDescription" field of the JSON response. The description should effectively summarize the scope and depth of the question set and be included in every JSON response.

11. Ensure that the "setTitle" and "setDescription" fields are always present and populated in the JSON response, even if there are no more questions to generate. These fields are crucial for providing context and metadata about the question set.

12. Continue generating questions across multiple requests, with the number of questions per topic not exceeding the values in the "topics" array provided in the <topics> tag and the total number of questions per request not exceeding 6. Avoid generating an excessive number of questions that compromises relevance.

13. Before providing the final JSON response, thoroughly proofread and refine the generated content to ensure it meets the highest standards of accuracy, clarity, and coherence. Review the questions, answer options, correct answers, and explanations to identify and correct any errors, inconsistencies, or areas that need improvement. Make any necessary revisions to enhance the overall quality and effectiveness of the question set.

14. If thorough analysis of the <topics>, <source>, and <generatedQuestions> tags confirms that all relevant information in the <source> content has been exhaustively covered by the questions across all requests, leaving no unaddressed questions, respond with an empty "questions" array in the JSON format specified in instruction 15. Do not prematurely end the question generation process without meticulously analyzing the <topics>, <source>, and <generatedQuestions> tags.

15. Respond with only the JSON, without any additional remarks. The JSON should have keys in English and values in Korean, using the following structure:

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

// 새로운 시스템 템플릿 추가
const existingQuestionConversionTemplate = `
You are an expert question converter tasked with analyzing and converting existing questions into a specific format for our service. Your job is to take the complete questions, options, answers, and explanations provided in the <input> tags and convert them exactly as they are into our service's JSON format. This process may span multiple requests to handle large inputs.

Follow these instructions carefully:

1. Do not generate new questions or modify the existing content in any way. Your task is to convert the given questions exactly as they are.

2. Analyze the input to determine if each question is a multiple-choice question (type: "obj") or a subjective question (type: "sub").

3. For multiple-choice questions:
   - Set the "type" key to "obj".
   - Include all given options in the "options" array.
   - Set the "answer" array to contain the index(es) of the correct option(s). The index is zero-based.
   - If multiple correct answers are indicated, make sure to include all of them in the "answer" array.

4. For subjective questions:
   - Set the "type" key to "sub".
   - Include the given answer in the "answer" field.

5. Copy the explanation exactly as provided into the "explanation" field.

6. Ensure that all text (questions, options, answers, and explanations) is preserved exactly as given in the input, including any specific wording or phrasing.

7. Generate a relevant "setTitle" based on the overall theme of the questions provided.

8. Generate a concise "setDescription" that summarizes the content of the question set.

9. Process a maximum of 6 questions per request. If there are more questions in the input, process them in subsequent requests.

10. Before processing new questions, carefully review the <generatedQuestions> tag to avoid duplicating questions that have already been converted.

11. If all questions from the input have been processed, return an empty "questions" array in the JSON response.

12. Respond with only the JSON, without any additional remarks. The JSON should have keys in English and values in the language of the input, using the following structure:

{{
  "setTitle": "문제 세트 제목",
  "setDescription": "문제 세트 설명",
  "questions": [
    {{
      "type": "obj",
      "question": "문제 내용",
      "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
      "answer": [0],
      "explanation": "설명"
    }},
    {{
      "type": "sub",
      "question": "주관식 문제 내용",
      "answer": "주관식 답변",
      "explanation": "설명"
    }}
  ]
}}

Ensure that the output JSON strictly follows this format and contains all the information provided in the input, processing a maximum of 6 questions per request.
`;

// 새로운 Human 템플릿 추가
const existingQuestionHumanTemplate = `
<input>
{input}
</input>
<generatedQuestions>
{generatedQuestions}
</generatedQuestions>
`;

// 새로운 시스템 메시지 프롬프트
export const existingQuestionConversionSystemPrompt =
  SystemMessagePromptTemplate.fromTemplate(existingQuestionConversionTemplate);

// 새로운 Human 메시지 프롬프트
export const existingQuestionConversionHumanPrompt =
  HumanMessagePromptTemplate.fromTemplate(existingQuestionHumanTemplate);

// 새로운 대화 프롬프트 템플릿 생성
export const existingQuestionConversionChatPrompt =
  ChatPromptTemplate.fromMessages([
    existingQuestionConversionSystemPrompt,
    existingQuestionConversionHumanPrompt,
  ]);

// JSON ASSISTANT와 함께 새로운 대화 프롬프트 템플릿 생성
export const existingQuestionConversionChatPromptWithJSON =
  ChatPromptTemplate.fromMessages([
    existingQuestionConversionSystemPrompt,
    existingQuestionConversionHumanPrompt,
    jsonAssistantMessage,
  ]);
