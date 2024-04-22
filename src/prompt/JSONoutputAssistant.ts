import { AIMessagePromptTemplate } from "@langchain/core/prompts";

// 확실한 JSON 응답을 위한 프롬프트 템플릿
export const jsonAssistantMessage = AIMessagePromptTemplate.fromTemplate("{{");
