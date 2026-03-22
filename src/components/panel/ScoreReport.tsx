"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertCircle, ChevronDown, ChevronRight, Trophy } from "lucide-react";
import { useState } from "react";
import { useSimulationStore } from "@/store/simulationStore";
import type { CategoryScore } from "@/types/scoring";

function CategorySection({ category }: { category: CategoryScore }) {
  const [expanded, setExpanded] = useState(false);
  const pct = (category.score / category.maxScore) * 100;

  const barColor =
    pct >= 80 ? "bg-emerald-500" :
    pct >= 50 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="rounded-lg bg-zinc-800/50 px-3 py-2.5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-3 w-3 text-zinc-400" />
          ) : (
            <ChevronRight className="h-3 w-3 text-zinc-400" />
          )}
          <span className="text-xs font-medium text-zinc-300">
            {category.category}
          </span>
        </div>
        <span className="font-mono text-xs text-zinc-400">
          {category.score}/{category.maxScore}
        </span>
      </button>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {expanded && (
        <div className="mt-3 space-y-1.5">
          {category.passed.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
              <span className="text-xs text-zinc-400">{item}</span>
            </div>
          ))}
          {category.feedback.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
              <span className="text-xs text-zinc-400">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ScoreReport() {
  const scoreResult = useSimulationStore((s) => s.scoreResult);

  if (!scoreResult) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/80">
          <Trophy className="h-5 w-5 text-zinc-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-zinc-400">Ready to evaluate</p>
          <p className="mt-1 max-w-[220px] text-xs text-zinc-400">
            Design your system on the canvas, then click Score to see how you did
          </p>
        </div>
      </div>
    );
  }

  const topImprovements = scoreResult.categories
    .flatMap((c) => c.feedback)
    .slice(0, 3);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-1">
        {/* Overall score */}
        <div className="flex flex-col items-center gap-2 py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative flex items-center justify-center"
          >
            {(() => {
              const radius = 38;
              const circumference = 2 * Math.PI * radius;
              const progress = (scoreResult.total / 100) * circumference;
              const strokeColor = scoreResult.total >= 71 ? '#10b981' : scoreResult.total >= 51 ? '#22d3ee' : scoreResult.total >= 31 ? '#f59e0b' : '#ef4444';
              return (
                <svg width="96" height="96" className="-rotate-90">
                  <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(39,39,42,0.8)" strokeWidth="6" />
                  <motion.circle
                    cx="48" cy="48" r={radius} fill="none"
                    stroke={strokeColor} strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
              );
            })()}
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-3xl font-bold text-zinc-100">
                {scoreResult.total}
              </span>
              <span className="text-[11px] text-zinc-400">/ 100</span>
            </div>
          </motion.div>

          <Badge
            variant="outline"
            className={`${scoreResult.verdictColor} border-current/30 bg-current/5 px-3 py-0.5 text-xs font-semibold`}
          >
            {scoreResult.verdict}
          </Badge>

          <p className="text-center text-xs text-zinc-400">
            {scoreResult.summary}
          </p>
        </div>

        <Separator className="bg-zinc-800/60" />

        {/* Category breakdowns */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Categories
          </p>
          {scoreResult.categories.map((cat) => (
            <CategorySection key={cat.category} category={cat} />
          ))}
        </div>

        {/* Top improvements */}
        {topImprovements.length > 0 && (
          <>
            <Separator className="bg-zinc-800/60" />
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Top Improvements
              </p>
              {topImprovements.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10 px-2.5 py-2"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-[11px] font-bold text-cyan-400">
                    {i + 1}
                  </span>
                  <span className="text-xs text-zinc-400">{item}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
