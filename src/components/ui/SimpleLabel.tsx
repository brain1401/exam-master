import { cn } from "@/lib/utils";

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
      className={cn(
        `text-md ${margin ? "mb-2" : ""} select-none font-semibold `,
        className,
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
