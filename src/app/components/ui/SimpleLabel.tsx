import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  htmlFor?: string;
  margin?: boolean;
  className?: string;
};

export default function SimpleLabel({
  children,
  htmlFor,
  margin = true,
  className,
}: Props) {
  return (
    <label
      className={twMerge(
        `text-md ${margin ? "mb-2" : ""} font-semibold ${className}`,
      )}
      onClick={(e) => e.preventDefault()}
      htmlFor={htmlFor ?? ""}
    >
      {children}
    </label>
  );
}
