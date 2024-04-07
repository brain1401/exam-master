type Props = {
  children: React.ReactNode;
};

export default function ExamLayout({ children }: Props) {
  return <section className="mx-auto w-full max-w-3xl py-[3rem] px-[1.5rem]">{children}</section>;
}
