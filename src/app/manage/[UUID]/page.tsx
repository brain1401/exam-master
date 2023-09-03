
type Props = {
  params: {
    UUID: string;
  }
}

export default function page({params}: Props) {
  return (
    <div>{params.UUID}</div>
  )
}