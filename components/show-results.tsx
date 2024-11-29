import { CheckCircle } from "lucide-react";
import { delay, motion } from "motion/react";
import { useState } from "react";
import { ResultWithChoice } from "../lib/hooks/useRealtimeResults";
import { cn, shootConfetti } from "../lib/utils";
const MotionCheck = motion.create(CheckCircle);

export const ShowResults: React.FC<{
  results: ResultWithChoice[];
  showResultsInitially: boolean;
}> = ({ results, showResultsInitially }) => {
  const [showResults, setShowResults] = useState(showResultsInitially);

  if (!showResults) {
    return (
      <>
        <MotionCheck
          key="results"
          className="size-20 text-green-500 place-self-center mt-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        />
        <motion.div
          key="results-text"
          className="grid gap-4"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.75 }}
          onAnimationComplete={() => {
            delay(() => setShowResults(true), 750);
          }}
        >
          <motion.h2 className="text-center text-xl" variants={variants}>
            The results are in...
          </motion.h2>
          <motion.h2 className="text-center text-xl" variants={variants}>
            And we have a winner!
          </motion.h2>
        </motion.div>
      </>
    );
  }

  return (
    <motion.div
      transition={{
        delay: 0.5,
        staggerChildren: 0.2,
      }}
      initial="hidden"
      animate="show"
      className="grid gap-2"
      onAnimationComplete={shootConfetti}
    >
      {results.map((result, index) => (
        <motion.div
          key={result.choice_id}
          className={cn(
            "p-4 border border-gray-300 rounded shadow-sm relative bg-background"
          )}
          variants={choiceVariants}
        >
          <div className="text-gray-500 text-xs text-right absolute right-4 top-2">
            ({result.points} points)
          </div>
          <span className="mr-2">#{index + 1}:</span>
          <motion.span className="text-lg font-semibold">
            {result.choice.name}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
};

const variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1 },
};

const choiceVariants = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1 },
};