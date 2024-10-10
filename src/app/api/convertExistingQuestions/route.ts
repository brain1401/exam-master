import { NextRequest, NextResponse } from "next/server";
import { existingQuestionConversionChatPromptWithJSON } from "@/prompt/problemGeneration";
import { GenerateQuestionResponse } from "@/types/problems";
import { claudeSonnet } from "@/const/bedrockClaudeModel";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    const model = new BedrockChat({
      temperature: 0.1,
      region: "ap-northeast-2",
      model: claudeSonnet,
      maxTokens: 4000,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
      },
    });
    const chain = existingQuestionConversionChatPromptWithJSON.pipe(model);

    const result = await chain.invoke({
      input: input,
    });

    const parsedResult: GenerateQuestionResponse = JSON.parse(
      result.content as string,
    );

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Error in convertExistingQuestions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
