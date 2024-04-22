import { GenerateQuestionResponse } from "@/types/problems";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  AIMessagePromptTemplate,
} from "@langchain/core/prompts";
import { jsonAssistantMessage } from "./JSONoutputAssistant";

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
You are an expert question generator tasked with creating a comprehensive set of questions based on the content within the <source> tags. The question generation process may span multiple requests to gradually cover all the content. 

Before generating questions, take a deep breath and carefully consider the following step-by-step instructions:

1. Analyze the content within the <source> tags and the previously generated questions in the <generatedQuestions> tags.

2. Generate questions that cover the remaining content within the <source> tags that has not been addressed by the questions in the <generatedQuestions> tags.

3. Maintain a ratio of 80% multiple choice questions (type: "obj") and 20% subjective questions (type: "sub") across all requests.

4. For multiple choice questions:
   - Generate 4 answer options.
   - Indicate the correct answer(s) by providing the index number(s) in the "answer" array. (e.g., [0] if the first option is correct, [1] if the second option is correct, [0, 2] if the first and third options are correct, etc.).
   - Explicitly state "해당하는 것을 모두 고르시오" in the question text for questions with multiple correct answers.
   - Set the "type" key to "obj".
   - Include a thorough explanation discussing why the correct answer is correct and the incorrect options are incorrect.

5. For subjective questions:
   - Provide a detailed and comprehensive answer that covers all relevant information.
   - Set the "type" key to "sub".

6. Ensure the questions, answer options, correct answers, and explanations are logically consistent and can be validated against the <source> content.

7. Generate a relevant and descriptive question set title based on the <source> content and include it in the "setTitle" field of every JSON response.

8. Provide a concise question set description based on the <source> content and include it in the "setDescription" field of every JSON response.

9. Continue generating questions across multiple requests until the <source> content is thoroughly covered, as determined by analyzing the <generatedQuestions> tags.

10. If the <generatedQuestions> fully cover the <source> content, set the "questions" key to an empty array in the output JSON.

11. Do not use honorifics or formal language in the questions and answers.

12. Respond with only the JSON, using the following structure:

{{
"setTitle": "토익 기출 문제",
"setDescription": "토익 시험 대비 문제 세트입니다.", 
"questions": ${JSON.stringify(exampleQuestions).replaceAll("}", "}}").replaceAll("{", "{{")}
}}

Follow these instructions meticulously to generate high-quality questions that comprehensively cover the <source> content.
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
You are an expert question generator tasked with creating a comprehensive set of subjective questions based on the content within the <source> tags. The question generation process may span multiple requests to gradually cover all the content.

Before generating questions, take a deep breath and carefully consider the following step-by-step instructions:

1. Analyze the content within the <source> tags and the previously generated questions in the <generatedQuestions> tags.

2. Generate subjective questions (type: "sub") that cover the remaining content within the <source> tags that has not been addressed by the questions in the <generatedQuestions> tags.

3. Refer to the subjective question examples within the "questions" array in the example JSON for tone and formatting, but do not use the actual questions from the examples.

4. For each subjective question:
   - Provide a detailed and comprehensive answer that covers all relevant information, including key terms, phrases, concepts, and explanations.
   - Set the "type" key to "sub".
   - Include a thorough explanation that provides additional context and insights.

5. Ensure the questions, answers, and explanations are logically consistent, relevant to the <source> content, and can be validated against it.

6. Generate a relevant and descriptive question set title based on the <source> content and include it in the "setTitle" field of every JSON response.

7. Provide a concise question set description based on the <source> content and include it in the "setDescription" field of every JSON response.

8. Continue generating questions across multiple requests until the <source> content is thoroughly covered, as determined by analyzing the <generatedQuestions> tags.

9. If the <generatedQuestions> fully cover the <source> content, set the "questions" key to an empty array in the output JSON.

10. Do not use honorifics or formal language in the questions and answers.

11. Respond with only the JSON, using the following structure:

{{
"setTitle": "토익 기출 문제",
"setDescription": "토익 시험 대비 문제 세트입니다.", 
"questions": ${JSON.stringify(exampleQuestions.filter((q) => q.type === "sub"))
  .replaceAll("}", "}}")
  .replaceAll("{", "{{")}
}}

Follow these instructions meticulously to generate high-quality subjective questions that comprehensively cover the <source> content.
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
You are an expert question generator tasked with creating a comprehensive set of multiple choice questions based on the content within the <source> tags. The question generation process may span multiple requests to gradually cover all the content.

Before generating questions, take a deep breath and carefully consider the following step-by-step instructions:

1. Analyze the content within the <source> tags and the previously generated questions in the <generatedQuestions> tags.

2. Generate multiple choice questions (type: "obj") that cover the remaining content within the <source> tags that has not been addressed by the questions in the <generatedQuestions> tags.

3. Refer to the multiple choice question examples within the "questions" array in the example JSON for tone and formatting, but do not use the actual questions from the examples.

4. For each multiple choice question:
   - Generate 4 answer options.
   - Indicate the correct answer(s) by providing the index number(s) in the "answer" array.
   - Explicitly state "해당하는 것을 모두 고르시오" in the question text for questions with multiple correct answers.
   - Set the "type" key to "obj".
   - Include a thorough explanation discussing why the correct answer is correct and the incorrect options are incorrect.

5. Ensure the questions, answer options, correct answers, and explanations are logically consistent, plausible based on the <source> content, and can be validated against it.

6. Generate a relevant and descriptive question set title based on the <source> content and include it in the "setTitle" field of every JSON response.

7. Provide a concise question set description based on the <source> content and include it in the "setDescription" field of every JSON response.

8. Continue generating questions across multiple requests until the <source> content is thoroughly covered, as determined by analyzing the <generatedQuestions> tags.

9. If the <generatedQuestions> fully cover the <source> content, set the "questions" key to an empty array in the output JSON.

10. Do not use honorifics or formal language in the questions and answers.

11. Respond with only the JSON, using the following structure:

{{
"setTitle": "토익 기출 문제",
"setDescription": "토익 시험 대비 문제 세트입니다.", 
"questions": ${JSON.stringify(exampleQuestions.filter((q) => q.type === "obj"))
  .replaceAll("}", "}}")
  .replaceAll("{", "{{")}
}}

Follow these instructions meticulously to generate high-quality multiple choice questions that comprehensively cover the <source> content.
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
