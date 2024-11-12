import Announcements from "@/components/ui/Announcements";

// about 경로는 모든 사용자에게 동일한 페이지를 제공하므로 스태틱 처리
export const dynamic = "force-static";

export default function page() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 md:py-10">
      <div className="w-full max-w-2xl">
        <Announcements />
      </div>
    </div>
  );
}
