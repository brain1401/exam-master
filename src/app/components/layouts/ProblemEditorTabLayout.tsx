type Props = {
  children: React.ReactNode;
};

export default function ProblemEditorTabLayout({ children }: Props) {
  return (
    <form
      className="flex flex-col  rounded-xl bg-gray-100 p-5"
      id="problemEditorLayout"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
