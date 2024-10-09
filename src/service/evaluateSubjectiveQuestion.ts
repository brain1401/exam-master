import { claudeSonnet } from "@/const/bedrockClaudeModel";
import { problemEvaluationChatPromptWithJSON } from "@/prompt/problemEvaluation";
import {
  SubjectiveEvaluation,
  SubjectiveEvaluationSchema,
} from "@/types/problems";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new BedrockChat({
  temperature: 0,
  region: "ap-northeast-2",
  model: claudeSonnet,
  maxTokens: 500,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
  },
});

export async function evaluateSubjectiveProblem({
  question,
  answer,
  userAnswer,
}: {
  question: string;
  answer: string;
  userAnswer: string;
}) {
  const chain = RunnableSequence.from([
    problemEvaluationChatPromptWithJSON,
    model,
  ]);

  const response = await chain.invoke(
    {
      question,
      answer,
      userAnswer,
    },
    {},
  );

  try {
    const content = "{" + response.content;

    console.log(content);

    const json = JSON.parse(content);

    console.log(json);

    if (SubjectiveEvaluationSchema.safeParse(json).success === true) {
      return json as SubjectiveEvaluation;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
