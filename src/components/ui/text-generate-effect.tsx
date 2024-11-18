"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1.5,
        delay: stagger(0.3),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.p ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className={`${idx === 4 || idx === 5
                  ? "bg-gradient-to-r from-indigo-500 to-cyan-300 text-transparent bg-clip-text"
                  : "text-slate-100 font-semibold"
                } opacity-0`} style={{
                  filter: filter ? "blur(10px)" : "none",
                }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.p>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="text-5xl font-extrabold text-center lg:text-left pb-2 lg:pe-8 leading-snug inline-block">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
