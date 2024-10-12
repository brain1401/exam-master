import Announcements from "@/components/ui/Announcements";

export default function page() {
  return (
    <div className="flex flex-1 justify-center items-center p-4 md:py-10">
      <div className="w-full max-w-2xl">
        <Announcements />
      </div>
    </div>
  );
}
