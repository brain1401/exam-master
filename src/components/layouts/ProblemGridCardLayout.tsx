type Props = {
  children: React.ReactNode;
};

export default function ProblemGridCardLayout({ children }: Props) {
  return (
    <li className="max-w-[50%] basis-[50%] px-2 md:h-auto md:max-w-[25%] md:basis-[25%]">
      {children}
    </li>
  );
}
