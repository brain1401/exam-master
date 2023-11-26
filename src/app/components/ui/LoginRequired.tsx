import Announcements from "./Announcements";

export default function LoginRequired() {
  return (
    <>
      <h1 className="mx-auto mt-10 w-[40%] rounded-xl bg-red-500 p-5 text-center text-2xl text-white">{`서비스를 이용하려면 로그인이 필요합니다!`}</h1>
      <Announcements />
    </>
  );
}
