type Props = {
  params: {
    UUID: string;
  };
};

export default function PublicProblemResult({ params: { UUID } }: Props) {
  return <div>{UUID}</div>;
}
