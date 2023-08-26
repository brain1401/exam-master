import CreateProblemsCard from "./CreateProblemsCard";
import CreateProblemsOption from "./CreateProblems/CreateProblemsOption";
import NextOrPrevButtons from "./CreateProblems/NextOrPrevButtons";
import CurrentCardIndicator from "./CreateProblems/CurrentCardIndicator";
import CreateProblemsSumbitButton from "./CreateProblems/CreateProblemsSumbitButton";

export default function CreateProblems() {
  return (
    <section className="p-3 mt-10 max-w-[70rem] mx-auto">
      <CreateProblemsOption />
      <CurrentCardIndicator />

      <CreateProblemsCard />

      <NextOrPrevButtons />
      <CreateProblemsSumbitButton />
    </section>
  );
}
