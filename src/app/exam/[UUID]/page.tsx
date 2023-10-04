"use client";

type Props = {
  params: {
    UUID: string;
  };
};

export default function DetailExamPage({ params: { UUID } }: Props) {

 
  return (
    <section>
      <div>DetailExamPage</div>
      <div>{UUID}</div>
    </section>
  );
}
