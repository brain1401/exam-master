type Props = {
  children: React.ReactNode;
};

export default function ProblemEditorTabLayout({ children }: Props) {
  return (
    <form
      className="flex flex-col overflow-y-auto rounded-xl bg-gray-100 p-5 custom-scroll"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
