"use client";
import { signIn, signOut } from "next-auth/react";
import NextUIButton from "./NextUIButton";

type Props = {
  type: "login" | "logout";
};

export default function LoginButton({ type }: Props) {
  return (
    <NextUIButton onClick={() => (type === "login" ? signIn() : signOut())} className="">
      {type === "login" ? "로그인" : "로그아웃"}
    </NextUIButton>
  );
}
