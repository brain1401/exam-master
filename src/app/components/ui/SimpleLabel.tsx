
type Props = {
  children: string;
  htmlFor?: string;
}

export default function SimpleLabel({children, htmlFor}: Props) {
  return (
    <label
      className="text-lg font-semibold mb-2"
      onClick={(e) => e.preventDefault()}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}