import { signIn, signOut } from "next-auth/react";

type Props = {
  type: "login" | "logout";
};

const BUTTON_CLASSNAME =
  "bg-blue-500 hover:bg-blue-700 text-white py-[.3rem] px-10 m-1 font-bold px-[0.3rem] md:py-2 md:px-4 rounded";

export default function LoginButton({ type }: Props) {
  return type === "login" ? (
    <button onClick={() => signIn()} className={BUTTON_CLASSNAME}>
      로그인
    </button>
  ) : (
    <button onClick={() => signOut()} className={BUTTON_CLASSNAME}>
      로그아웃
    </button>
  );
}
