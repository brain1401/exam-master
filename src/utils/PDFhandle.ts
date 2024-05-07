export async function pdfToBase64(pdf: File) {
  const arrayBuffer = await pdf.arrayBuffer();

  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return base64;
}
