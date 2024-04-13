import { GenerateQuestionResponseSchema } from "@/types/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestBody = await req.json();

  const prevQuestions = requestBody.prevQuestions;
  const source = requestBody.source;
  const totalQuestions = requestBody.totalQuestions;
  const questionCount = requestBody.questionCount;

  if (!prevQuestions || !source || !totalQuestions || !questionCount) {
    return NextResponse.json({ error: "필수 값이 없습니다.", status: 400 });
  }

  const content = `<questionCount>${questionCount}</questionCount>\n\n<totalQuestions>${totalQuestions}</totalQuestions>\n\n<prevQuestions>${prevQuestions}</prevQuestions>\n\n<source>${source}</source>`;

  console.log(
    "content :",
    `<questionCount>${questionCount}</questionCount>\n\n<totalQuestions>${totalQuestions}</totalQuestions>\n\n<prevQuestions>${prevQuestions}</prevQuestions>\n\n<source></source>`,
  );

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          '<prompt>\nYour task is to generate a comprehensive question set based on the entire content within the <source> tags. This task may require multiple requests to complete, as the generated questions must cover all the information that can be potentially asked from the given source material. Generate questions with a ratio of 80% multiple choice (type: "obj") and 20% short answer (type: "sub") across all API requests. When generating questions, refer to the question examples within the JSON for tone and formatting.\n\nIf the <prevQuestions> tags are empty, this indicates that it is the first request. In this case:\n1. Thoroughly analyze the entire content within the <source> tags to identify all the pieces of information that can be used to create questions.\n2. Determine the total number of questions that can be generated to comprehensively cover all the identified information.\n3. Include this total question count in the JSON response with the key "totalQuestions".\n4. If the total question count exceeds 10, generate the first set of 10 questions, ensuring that they cover the initial portion of the source content corresponding to the first 10 questions. For example, if the total question count is 30, use approximately the first one-third of the <source> content to generate the first 10 questions.\n5. Set the <questionCount> tag to the number of questions that will be generated in this response.\n\nIf the <prevQuestions> tags are not empty:\n1. Carefully analyze the questions provided in the <prevQuestions> tags to understand the content and information they cover.\n2. Identify the portion of the <source> content that was used to generate the questions in <prevQuestions>. This will help determine which part of the content to focus on for generating new questions.\n3. Analyze the remaining content within the <source> tags, starting from the point where the previous questions left off. This ensures that you are progressing through the source content sequentially with each request.\n4. Generate the next set of questions (maximum 10) based on the identified remaining content, ensuring that the new questions do not overlap with the content covered by the questions in the <prevQuestions> tags.\n5. Cross-check the questions that will be generated against the questions in the <prevQuestions> tags to identify and remove any potential duplicates or highly similar questions. This step is crucial to prevent redundancy in the overall question set.\n6. Set the <questionCount> tag to the number of new questions that will be generated in this response, after accounting for the removal of any potential duplicates.\n7. If there is no more content left to generate questions from, do not generate any more questions and set <questionCount> to 0.\n\nYou must follow all of these instructions:\n\n1. For multiple choice questions, each question must have 4 answer options. Indicate the correct answer(s) for each question using the index number(s) of the correct option(s) in the "options" array (e.g., 0 for the first option, 1 for the second option, etc.). Set the "type" key to "obj" for multiple choice questions. Some questions may have multiple correct answers.\n\n2. For short answer questions, provide the question and all acceptable correct answers. The correct answer(s) should be a single word or a combination of up to two words to facilitate easy grading through string comparison. Include all acceptable words or combinations of words that would be considered correct in the "answer" array. Set the "type" key to "sub" for short answer questions.\n\n3. Provide a detailed and thorough explanation for each question, discussing why the correct answer is correct and the incorrect options are incorrect. The explanations should be comprehensive and not overly brief.\n\n4. Ensure the questions address key information in the text and the answer options are plausible based on the source content.\n\n5. Make sure there is consistency between the question, answer options, and the correct answer(s).\n\n6. Verify that the question, answer options, and correct answer(s) can be validated against the source content.\n\n7. Ensure that the question, answer options, correct answer(s), and explanation are all logically consistent with each other.\n\n8. After generating the questions, verify that they comprehensively cover the designated portion of the <source> content without any significant omissions. If any key information has been missed, generate additional questions to address those gaps.\n\n9. Respond with only the JSON, without any additional remarks. The JSON should have keys in English and values in Korean, using the following structure:\n\n```json\n{\n"totalQuestions": <총 문제 수>, \n"questionCount": <현재 요청에서 생성 될 문제 수(중복 제거 후)>,\n"questions": [\n{\n"type": "obj",\n"question": "데이터베이스에서 릴레이션에 대한 설명으로 틀린 것은?",\n"options": [\n"모든 튜플은 서로 다른 값을 가지고 있다.",  \n"하나의 릴레이션에서 튜플은 특정한 순서를 가진다.",\n"각 속성은 릴레이션 내에서 유일한 이름을 가진다.", \n"모든 속성 값은 원자 값(atomic value)을 가진다."\n],\n"answer": [1],  \n"explanation": "릴레이션에서 튜플은 기본적으로 순서가 없으며, 튜플의 순서는 쿼리 결과에 영향을 주지 않습니다. 나머지 설명들은 릴레이션의 특성을 잘 설명하고 있습니다."\n},\n{\n"type": "obj",\n"question": "취약점 관리를 위한 응용 프로그램의 보안 설정과 가장 거리가 먼 것은?", \n"options": [\n"서버 관리실 출입 통제",\n"실행 프로세스 권한 설정",  \n"운영체제의 접근 제한",\n"운영체제의 정보 수집 제한" \n],\n"answer": [0],\n"explanation": "서버 관리실 출입 통제는 물리적 보안에 해당하며, 응용 프로그램의 보안 설정과는 직접적인 연관이 없습니다. 나머지 선택지들은 모두 응용 프로그램의 보안 설정과 관련이 있는 내용입니다."\n},  \n{\n"type": "obj",\n"question": "무각적색(PPRR)과 유각백색(pprr)인 Shorthorn종 육우를 교배하여 생산한 F1(PpRr)의 표현형이 무각조모색으로 나타났다. 멘델이 세웠던 가설 중 어느 것에 모순되는가?",\n"options": [  \n"특정 형질의 발현을 조절하는 유전인자는 한 쌍으로 되어 있다.",\n"한 쌍의 유전인자는 양친으로부터 하나씩 물려받은 것이다.", \n"생식 세포가 만들어질 때 유전인자들은 분리된 단위로서, 각 배우자에게 독립적으로 분배된다.",\n"한 쌍의 유전인자가 서로 다를 때 한 인자가 다른 인자를 억제시키고 그 인자만이 발현된다." \n],\n"answer": [3],\n"explanation": "무각과 적색이 모두 발현된 것으로 보아, 이 경우에는 한 인자가 다른 인자를 완전히 억제하지 않고 두 인자가 함께 발현되었음을 알 수 있습니다. 따라서 멘델의 우성의 법칙에 모순됩니다."\n},\n{  \n"type": "sub",\n"question": "많은 데이터를 그림을 이용하여 집합의 범위와 중앙값을 빠르게 확인할 수 있으며, 또한 통계적으로 이상 값이 있는지 빠르게 확인이 가능한 시각화 기법은 무엇인가?", \n"answer": ["박스플롯", "boxplot"], \n"explanation": "박스플롯(Boxplot)은 데이터의 분포를 간단하게 표현할 수 있는 시각화 방법입니다. 박스의 양쪽 끝은 1사분위수와 3사분위수를 나타내어 데이터의 범위를 확인할 수 있고, 박스 안의 선은 중앙값을 나타냅니다. 또한 박스 바깥의 점들을 통해 이상치를 쉽게 발견할 수 있습니다."\n},\n{\n"type": "obj", \n"question": "다음 중 나무위키 게시판에서 볼 수 있는 게시판으로 옳은 것을 모두 고르시오. (단, 정답은 한 개일 수도 있다.)",\n"options": [\n"공지사항",\n"그루터기", \n"신고 게시판",  \n"정답 없음"\n],\n"answer": [0, 1],\n"explanation": "나무위키에는 공지사항 게시판과 그루터기 게시판이 있습니다. 공지사항 게시판은 운영진의 공지를 올리는 곳이고, 그루터기 게시판은 편집증명 신청, 문서 삭제 신청 등 위키 운영과 관련된 토론이 이루어지는 공간입니다. 하지만 신고 게시판은 나무위키에 존재하지 않습니다." \n}\n]\n}\n```\n\nAfter generating the questions, double-check that the number of questions in the "questions" array matches the value of <questionCount>. If there is a mismatch, adjust the <questionCount> value or remove/add questions as needed to ensure consistency.\n\nIf there is no more content left to generate questions from and the <prevQuestions> tags are not empty, respond with an empty "questions" array and set <questionCount> to 0.\n\n</prompt>\n\n',
      },
      {
        role: "user",
        content: content,
      },
    ],
    temperature: 0.15,
    max_tokens: 4095,
    response_format: { type: "json_object" },
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const text = response.choices[0].message.content ?? "";

  const parsedText = JSON.parse(text);

  if (GenerateQuestionResponseSchema.safeParse(parsedText).success === false) {
    return NextResponse.json({ error: "파싱에 실패했습니다.", status: 400 });
  }

  return NextResponse.json(
    parsedText ?? { error: "파싱에 실패했습니다.", status: 400 },
  );
}
