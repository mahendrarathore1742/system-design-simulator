"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PROBLEMS } from "@/data/problems";
import { useAppStore } from "@/store/appStore";

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "Medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "Hard":
      return "border-rose-500/30 bg-rose-500/10 text-rose-400";
    default:
      return "";
  }
}

export function ProblemSelector() {
  const selectedProblemId = useAppStore((s) => s.selectedProblemId);
  const setSelectedProblem = useAppStore((s) => s.setSelectedProblem);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-3">
        {PROBLEMS.map((problem) => (
          <button
            key={problem.id}
            onClick={() => setSelectedProblem(problem.id)}
            className={`flex w-full flex-col gap-1.5 rounded-lg px-2.5 py-2 text-left transition-all ${
              problem.id === selectedProblemId
                ? "border border-cyan-500/20 bg-cyan-500/10"
                : "border border-transparent hover:bg-zinc-800/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium ${
                  problem.id === selectedProblemId
                    ? "text-cyan-300"
                    : "text-zinc-300"
                }`}
              >
                {problem.title}
              </span>
              <Badge
                variant="outline"
                className={`h-4 px-1.5 text-[9px] font-medium ${getDifficultyColor(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {problem.tags.map((tag, i) => (
                <span key={tag} className="text-[9px] text-zinc-600">
                  {tag}{i < problem.tags.length - 1 ? " ·" : ""}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
