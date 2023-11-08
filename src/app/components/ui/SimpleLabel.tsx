import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  htmlFor?: string;
  margin?: boolean;
  preventDefault?: boolean;
  className?: string;
};

export default function SimpleLabel({
  children,
  htmlFor,
  margin = true,
  preventDefault = false,
  className,
}: Props) {
  return (
    <label
      className={twMerge(
        `text-md ${margin ? "mb-2" : ""} font-semibold select-none ${className}`,
      )}
      onClick={(e) => {
        preventDefault ? e.preventDefault() : null;
      }}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
