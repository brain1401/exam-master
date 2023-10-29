type Props = {
  children: string;
  htmlFor?: string;
};

export default function SimpleLabel({ children, htmlFor }: Props) {
  return (
    <label
      className="mb-2 text-lg font-semibold"
      onClick={(e) => e.preventDefault()}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
