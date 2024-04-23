import axios from "axios";

export async function noticeToPhone({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const key = process.env.PHONE_NOTICE_KEY;
  if (!key) throw new Error("PHONE_NOTICE_KEY is not defined");

  await axios.get(
    `https://asia-northeast3-noti-lab-production.cloudfunctions.net/api/notification/v1/notification?nickname=Aiden&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&secretKey=${process.env.PHONE_NOTICE_KEY}`,
  );
}
