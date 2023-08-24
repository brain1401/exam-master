import CreateProblemsCard from "./CreateProblemsCard";
import CreateProblemsOption from "./CreateProblems/CreateProblemsOption";
import NextOrPrevButtons from "./CreateProblems/NextOrPrevButtons";
import CurrentCardIndicator from "./CreateProblems/CurrentCardIndicator";
import CreateProblemsSumbitButton from "./CreateProblems/CreateProblemsSumbitButton";

export default function CreateProblems() {
  return (
    <section className="p-3">
      <CreateProblemsOption />
      <CurrentCardIndicator />

      <CreateProblemsCard />

      <NextOrPrevButtons />
      <CreateProblemsSumbitButton />
    </section>
  );
}
