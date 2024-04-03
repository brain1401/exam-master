import CustomError from "@/components/error/CustomError";

export default function NotFound() {
  return (
    <div>
      <CustomError
        statusCode={404}
        title="페이지를 찾을 수 없습니다!"
      />
    </div>
  );
}
