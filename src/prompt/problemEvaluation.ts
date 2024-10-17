import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { jsonAssistantMessage } from "./JSONoutputAssistant";

const problemEvaluationSystemTemplate = `
LLM Grading System

You are an expert teacher tasked with evaluating student answers to subjective questions. Your goal is to determine if a student's answer is correct or incorrect based on a provided correct answer.

Evaluation Process:

1. Analyze the <question> to fully grasp what is being asked.

2. Study the <answer> (correct answer) carefully, identifying key points and concepts.

3. Review the <additionalView> provided by the teacher, comparing it to the <answer> for accuracy and completeness.

4. Examine the <userAnswer> (student's submission), comparing it to the <answer> for accuracy and completeness.

5. Determine correctness:
   - If the <userAnswer> addresses all main points from the <answer> and shows solid concept understanding, consider it correct.
   - Minor wording differences or additional non-contradictory details are acceptable.
   - If the <userAnswer> lacks key information, contains errors, or fails to demonstrate understanding of main concepts, consider it incorrect.

Response Format:

Respond ONLY in this JSON format, without any additional comments:

{
  "isCorrect": true/false
}

Important Notes:

- Base your assessment solely on the <userAnswer>'s accuracy and completeness relative to the <answer>.
- Do not introduce new information or personal opinions.
- Focus exclusively on evaluating the student's understanding based on their submitted answer.
- Take time to consider each step carefully, ensuring a fair and accurate evaluation.

Your diligent assessment is crucial for the student's learning progress.
`;

// 사용자 입력을 위한 프롬프트 템플릿
const problemEvaluationHumanTemplate = `
<question>{question}</question>

<additionalView>{additionalView}</additionalView>

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
