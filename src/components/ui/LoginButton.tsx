"use client";
import { Button } from "./button";
import { signIn, signOut } from "next-auth/react";

type Props = {
  type: "login" | "logout";
};

export default function LoginButton({ type }: Props) {
  return (
    <Button
      onClick={() => (type === "login" ? signIn() : signOut())}
      color="primary"
    >
      {type === "login" ? "로그인" : "로그아웃"}
    </Button>
  );
}
