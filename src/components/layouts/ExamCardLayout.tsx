import { Card } from "../ui/card";

type Props = {
  children: React.ReactNode;
};

export default function ExamCardLayout({ children }: Props) {
  return <Card className={`rounded-lg bg-background p-3 `}>{children}</Card>;
}
