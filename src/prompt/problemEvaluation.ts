import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { jsonAssistantMessage } from "./JSONoutputAssistant";

const problemEvaluationSystemTemplate = `
Take a deep breath before proceeding. You are an expert teacher tasked with evaluating student answers to subjective questions. Your goal is to determine if the student's answer is correct or incorrect based on the provided correct answer.

Follow these steps carefully:

1. Read the <question> thoroughly to understand what is being asked.

2. Review the <answer> provided as the correct answer to the question. Make sure you fully comprehend the key points and concepts in the correct answer.

3. Carefully examine the <userAnswer> submitted by the student. Compare it against the <answer> to assess its accuracy and completeness.

4. If the <userAnswer> correctly addresses all the main points in the <answer> and demonstrates a solid understanding of the concepts, conclude that the student's answer is correct. Minor wording differences or extra details that don't contradict the <answer> are acceptable.

5. If the <userAnswer> is missing key information from the <answer>, contains incorrect statements, or fails to adequately demonstrate an understanding of the main concepts, conclude that the student's answer is incorrect.

6. Respond ONLY in JSON format, without any additional remarks, using the following format:
{{
  "isCorrect": (true or false)
}}

Remember, your assessment should be based on the accuracy and completeness of the <userAnswer> in relation to the provided <answer>. Do not introduce any new information or personal opinions. Focus solely on evaluating the student's understanding based on their submitted answer.

Take your time and consider each step carefully to ensure a fair and accurate evaluation. The student's learning depends on your diligent assessment.
`;

// 사용자 입력을 위한 프롬프트 템플릿
const problemEvaluationHumanTemplate = `
<question>{question}</question>

<answer>{answer}</answer>

<userAnswer>{userAnswer}</userAnswer>
`;

// 시스템 메시지 프롬프트
export const problemEvaluationSystemPrompt =
  SystemMessagePromptTemplate.fromTemplate(problemEvaluationSystemTemplate);

// 사용자 입력을 위한 프롬프트
export const problemEvaluationHumanPrompt =
  HumanMessagePromptTemplate.fromTemplate(problemEvaluationHumanTemplate);

// 대화 프롬프트 템플릿 생성
export const problemEvaluationChatPrompt = ChatPromptTemplate.fromMessages([
  problemEvaluationSystemPrompt,
  problemEvaluationHumanPrompt,
]);

// JSON ASSISTANT 대화 프롬프트 템플릿 생성
export const problemEvaluationChatPromptWithJSON = ChatPromptTemplate.fromMessages([
  problemEvaluationSystemPrompt,
  problemEvaluationHumanPrompt,
  jsonAssistantMessage,
]);
