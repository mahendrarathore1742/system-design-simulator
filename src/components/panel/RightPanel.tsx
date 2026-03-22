"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Info, Trash2, Lightbulb, ChevronDown, ChevronRight, CheckSquare } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";
import { useAppStore } from "@/store/appStore";
import { getProblemById } from "@/data/problems";
import { SimulationControls } from "./SimulationControls";
import { MetricsDisplay } from "./MetricsDisplay";
import { ScoreReport } from "./ScoreReport";
import { CapacityCalculator } from "./CapacityCalculator";

interface RightPanelProps {
  open: boolean;
  onSimulate: () => void;
}

export function RightPanel({ open, onSimulate }: RightPanelProps) {
  if (!open) return null;

  return (
    <aside className="glass-panel flex w-[300px] shrink-0 flex-col border-l border-zinc-800/80 transition-all duration-200">
      <Tabs defaultValue="properties" className="flex flex-1 flex-col">
        <TabsList className="mx-2 mt-2 h-9 w-auto shrink-0 bg-zinc-800/50">
          <TabsTrigger
            value="properties"
            className="h-8 px-4 text-sm data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
          >
            Properties
          </TabsTrigger>
          <TabsTrigger
            value="simulation"
            className="h-8 px-4 text-sm data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
          >
            Simulate
          </TabsTrigger>
          <TabsTrigger
            value="score"
            className="h-8 px-4 text-sm data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
          >
            Score
          </TabsTrigger>
          <TabsTrigger
            value="capacity"
            className="h-8 px-4 text-sm data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
          >
            Capacity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="mt-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3">
              <PropertiesTab />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="simulation" className="mt-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-4">
              <SimulationControls onSimulate={onSimulate} />
              <Separator className="bg-zinc-800/60" />
              <MetricsDisplay />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="score" className="mt-0 flex-1 overflow-hidden">
          <div className="h-full p-3">
            <ScoreReport />
          </div>
        </TabsContent>

        <TabsContent value="capacity" className="mt-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3">
              <CapacityCalculator />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function PropertiesTab() {
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId);
  const nodes = useCanvasStore((s) => s.nodes);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const deleteNode = useCanvasStore((s) => s.deleteNode);
  const selectedProblemId = useAppStore((s) => s.selectedProblemId);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const problem = getProblemById(selectedProblemId);

  return (
    <div className="space-y-4">
      {/* Problem requirements */}
      {problem && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Requirements — {problem.title}
          </p>
          <div className="space-y-1.5">
            {[
              { label: "Reads/sec", value: problem.requirements.readsPerSec.toLocaleString() },
              { label: "Writes/sec", value: problem.requirements.writesPerSec.toLocaleString() },
              { label: "Storage", value: `${problem.requirements.storageGB} GB` },
              { label: "Latency SLA", value: `< ${problem.requirements.latencyMs}ms` },
              { label: "Users", value: problem.requirements.users },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-md bg-zinc-800/60 px-2.5 py-1.5"
              >
                <span className="text-xs text-zinc-400">{item.label}</span>
                <span className="font-mono text-xs text-zinc-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {problem && problem.constraints.length > 0 && (
        <>
          <Separator className="bg-zinc-800/60" />
          <ConstraintsSection constraints={problem.constraints} />
        </>
      )}

      {/* Hints */}
      {problem && problem.hints.length > 0 && (
        <>
          <Separator className="bg-zinc-800/60" />
          <HintsSection hints={problem.hints} />
        </>
      )}

      <Separator className="bg-zinc-800/60" />

      {/* Selected node properties */}
      {selectedNode ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Component Properties
          </p>

          <div className="space-y-2">
            <div className="rounded-lg bg-zinc-800/60 px-3 py-2">
              <p className="text-xs font-medium text-zinc-200">
                {selectedNode.data.label}
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">
                {selectedNode.data.category} · Max {selectedNode.data.maxQPS === Infinity ? "∞" : selectedNode.data.maxQPS.toLocaleString()} QPS
              </p>
            </div>

            {/* Replicas slider */}
            {selectedNode.data.scalable && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs text-zinc-400">Replicas</label>
                  <span className="font-mono text-xs text-cyan-400">
                    {selectedNode.data.replicas}
                  </span>
                </div>
                <Slider
                  value={[selectedNode.data.replicas]}
                  onValueChange={(v) =>
                    updateNodeData(selectedNode.id, { replicas: Array.isArray(v) ? v[0] : v })
                  }
                  min={1}
                  max={20}
                  step={1}
                  className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-cyan-500 [&_[role=slider]]:bg-cyan-500"
                />
                <p className="mt-1 text-[11px] text-zinc-400">
                  Effective capacity: {((selectedNode.data.maxQPS === Infinity ? Infinity : selectedNode.data.maxQPS * selectedNode.data.replicas)).toLocaleString()} QPS
                </p>
              </div>
            )}

            {/* Info */}
            <div className="space-y-1">
              {[
                { label: "Base Latency", value: `${selectedNode.data.latencyMs}ms` },
                { label: "Scalable", value: selectedNode.data.scalable ? "Yes" : "No" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-400">{item.label}</span>
                  <span className="text-zinc-300">{item.value}</span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteNode(selectedNode.id)}
              className="w-full gap-1.5 border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <Trash2 className="h-3 w-3" />
              Remove Component
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80">
            <Info className="h-4 w-4 text-zinc-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-400">
              No component selected
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Click a component on the canvas to edit its properties.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ConstraintsSection({ constraints }: { constraints: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? constraints : constraints.slice(0, 3);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Constraints
      </p>
      <div className="space-y-1.5">
        {shown.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckSquare className="mt-0.5 h-3 w-3 shrink-0 text-zinc-400" />
            <span className="text-xs leading-relaxed text-zinc-400">{c}</span>
          </div>
        ))}
      </div>
      {constraints.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-cyan-300"
        >
          {expanded ? (
            <>
              <ChevronDown className="h-3 w-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronRight className="h-3 w-3" />
              Show {constraints.length - 3} more
            </>
          )}
        </button>
      )}
    </div>
  );
}

function HintsSection({ hints }: { hints: { title: string; content: string }[] }) {
  const [expandedHints, setExpandedHints] = useState<Set<number>>(new Set());

  const toggleHint = (index: number) => {
    setExpandedHints((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Hints
      </p>
      <div className="space-y-1.5">
        {hints.map((hint, i) => (
          <div
            key={i}
            className="rounded-lg border border-cyan-500/10 bg-cyan-500/5 overflow-hidden"
          >
            <button
              onClick={() => toggleHint(i)}
              className="flex w-full items-center gap-2 px-2.5 py-2 text-left"
            >
              <Lightbulb className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
              <span className="flex-1 text-xs font-medium text-cyan-300">
                {hint.title}
              </span>
              {expandedHints.has(i) ? (
                <ChevronDown className="h-3 w-3 shrink-0 text-cyan-500" />
              ) : (
                <ChevronRight className="h-3 w-3 shrink-0 text-cyan-500" />
              )}
            </button>
            {expandedHints.has(i) && (
              <div className="border-t border-cyan-500/10 px-2.5 py-2">
                <p className="text-xs leading-relaxed text-zinc-400">
                  {hint.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
