"use client";
import { Button } from "@nextui-org/react";
import { signIn, signOut } from "next-auth/react";

type Props = {
  type: "login" | "logout";
};

export default function LoginButton({ type }: Props) {
  return (
    <Button
      onClick={() => (type === "login" ? signIn() : signOut())}
      color="primary"
      radius="sm"
    >
      {type === "login" ? "로그인" : "로그아웃"}
    </Button>
  );
}
