"use client";

type Props = {
  UUID: string;
}
export default function ResultPage({ UUID }: Props) {

  return (
    <div>{UUID}</div>
  )
}