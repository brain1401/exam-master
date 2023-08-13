import { signIn, signOut } from "next-auth/react";

type Props = {
  type: "login" | "logout";
};

const BUTTON_CLASSNAME = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

export default function LoginButton({ type }: Props) {
  return type === "login" ? (
    <button onClick={() => signIn()} className={BUTTON_CLASSNAME}>로그인</button>
  ) : (
    <button onClick={() => signOut()} className={BUTTON_CLASSNAME}>
      로그아웃
    </button>
  );
}
