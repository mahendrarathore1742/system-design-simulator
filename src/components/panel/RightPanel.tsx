"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Info, Trash2 } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";
import { useAppStore } from "@/store/appStore";
import { getProblemById } from "@/data/problems";
import { SimulationControls } from "./SimulationControls";
import { MetricsDisplay } from "./MetricsDisplay";
import { ScoreReport } from "./ScoreReport";

interface RightPanelProps {
  open: boolean;
  onSimulate: () => void;
}

export function RightPanel({ open, onSimulate }: RightPanelProps) {
  if (!open) return null;

  return (
    <aside className="glass-panel flex w-[300px] shrink-0 flex-col border-l border-zinc-800/80">
      <Tabs defaultValue="properties" className="flex flex-1 flex-col">
        <TabsList className="mx-2 mt-2 h-8 w-auto shrink-0 bg-zinc-800/50">
          <TabsTrigger
            value="properties"
            className="h-6 px-2.5 text-[10px] data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
          >
            Properties
          </TabsTrigger>
          <TabsTrigger
            value="simulation"
            className="h-6 px-2.5 text-[10px] data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
          >
            Simulate
          </TabsTrigger>
          <TabsTrigger
            value="score"
            className="h-6 px-2.5 text-[10px] data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
          >
            Score
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
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
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
                className="flex items-center justify-between rounded-md bg-zinc-800/40 px-2.5 py-1.5"
              >
                <span className="text-[11px] text-zinc-500">{item.label}</span>
                <span className="font-mono text-[11px] text-zinc-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="bg-zinc-800/60" />

      {/* Selected node properties */}
      {selectedNode ? (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Component Properties
          </p>

          <div className="space-y-2">
            <div className="rounded-lg bg-zinc-800/40 px-3 py-2">
              <p className="text-xs font-medium text-zinc-200">
                {selectedNode.data.label}
              </p>
              <p className="mt-0.5 text-[10px] text-zinc-500">
                {selectedNode.data.category} · Max {selectedNode.data.maxQPS === Infinity ? "∞" : selectedNode.data.maxQPS.toLocaleString()} QPS
              </p>
            </div>

            {/* Replicas slider */}
            {selectedNode.data.scalable && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[11px] text-zinc-400">Replicas</label>
                  <span className="font-mono text-[11px] text-cyan-400">
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
                <p className="mt-1 text-[9px] text-zinc-600">
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
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className="text-zinc-500">{item.label}</span>
                  <span className="text-zinc-400">{item.value}</span>
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
            <Info className="h-4 w-4 text-zinc-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-400">
              No component selected
            </p>
            <p className="mt-1 text-[11px] text-zinc-600">
              Click a component on the canvas to edit its properties.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
