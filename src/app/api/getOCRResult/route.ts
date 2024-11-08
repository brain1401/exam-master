import { canUserGenerateProblemSet } from "@/service/user";
import DocumentIntelligence, {
  isUnexpected,
  getLongRunningPoller,
  AnalyzeResultOperationOutput,
} from "@azure-rest/ai-document-intelligence";
import { AzureKeyCredential } from "@azure/core-auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const key = process.env.AZURE_KEY || "";
const endpoint = process.env.AZURE_ENDPOINT || "";

const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!session || !email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const canGenerate = await canUserGenerateProblemSet(email);

  if (!canGenerate) {
    return NextResponse.json({ error: "Limit reached" }, { status: 403 });
  }

  const formData = await req.formData();

  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file found" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();

  const base64 = Buffer.from(arrayBuffer).toString("base64");

  try {
    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", "prebuilt-read")
      .post({
        contentType: "application/json",
        body: {
          base64Source: base64,
        },
      });

    if (isUnexpected(initialResponse)) {
      return NextResponse.json(
        { error: "Failed to analyze document" },
        { status: 500 },
      );
    }

    const poller = await getLongRunningPoller(client, initialResponse);
    const result = (await poller.pollUntilDone())
      .body as AnalyzeResultOperationOutput;

    return NextResponse.json(result.analyzeResult?.content);
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
}
