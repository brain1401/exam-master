"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SHA256 } from "crypto-js";
import { hashKey } from "@/const/hashKey";

type Props = {
  children: React.ReactNode;
};
export default function ProtectPage({ children }: Props) {
  const [password, setPassword] = useState("");

  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const passwordHash =
    "98c3c9ed9c0eda8c835648afc3e10c495b998d6656635e81319e25eb3dcc2ce7";

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const hash = SHA256(password, { hashKey: hashKey }).toString();

    if (hash === passwordHash) {
      setIsPasswordCorrect(true);
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <>
      {isPasswordCorrect ? (
        children
      ) : (
        <section className="h-full w-full py-12 md:py-24 lg:py-32">
          <div className="container grid max-w-md items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                관리자 전용 페이지
              </h2>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                이 페이지는 보호되어 있습니다. 계속 진행하려면 비밀번호를
                입력하세요.
              </p>
            </div>
            <form className="w-full space-y-2">
              <Input
                className="mx-auto max-w-lg"
                placeholder="비밀번호 입력"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="mx-auto w-full max-w-lg"
                type="submit"
                onClick={handleSubmit}
              >
                제출
              </Button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
